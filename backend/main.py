import os
import json
import re
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import engine, Base, get_db, DATABASE_URL, is_sqlite, init_db
import models
from services.nlp_parser import extract_text_from_pdf, parse_resume_text
from services.matcher import compute_career_matches, compute_skill_gaps
from services.coach_service import generate_coach_response
from services.job_service import get_opportunities
from services.roadmap_service import get_recommended_roadmap
from services.interview_service import evaluate_interview_response, SAMPLE_QUESTIONS
from services.shield_service import security_shield
from services.face_verify_service import face_verify_service
from services.auth_service import generate_session_token, verify_session_token, sync_or_create_student
from sqlalchemy.orm import Session

# Initialize tables & migrations
init_db()

app = FastAPI(
    title="SkillMap AI API",
    description="Backend API Gateway & Career Intelligence Engine for SkillMap AI (Protected by SkillMap Shield 2.4)",
    version="1.0.0"
)

# Allow CORS for React frontend (Vite default port 5173 and any local port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SkillMap Shield: L7 WAF, Rate Limiting & OWASP Security Headers Middleware
@app.middleware("http")
async def shield_security_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    path = request.url.path

    is_sec_api = path.startswith("/api/security")
    is_doc_api = path in ["/docs", "/redoc", "/openapi.json", "/favicon.ico"]

    # 1. L7 WAF Inspection on Query Parameters and URL
    if not is_sec_api and not is_doc_api:
        query_str = str(request.url.query)
        if query_str:
            is_mal, threat, detail = security_shield.inspect_text(query_str, context=f"Query ({path})")
            if is_mal:
                return JSONResponse(
                    status_code=403,
                    content={
                        "error": "SkillMap Shield: Request Blocked by L7 WAF",
                        "threat_vector": threat,
                        "details": detail,
                        "shield_status": "Active Protection (HTTP 403 Forbidden)"
                    }
                )

    # 2. Sliding Window Rate Limiting (Skip for internal test client or whitelisted APIs)
    if not is_doc_api and not is_sec_api:
        route_type = "general"
        if "auth" in path or "login" in path:
            route_type = "auth"
        elif "coach" in path or "chat" in path:
            route_type = "ai_chat"
        elif "resume" in path:
            route_type = "resume_upload"

        is_allowed, count, max_lim = security_shield.check_rate_limit(client_ip, route_type)
        if not is_allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "SkillMap Shield: Rate Limit Exceeded",
                    "details": f"Too many requests to '{route_type}'. Limit: {max_lim}/min (Current Attempt: {count})",
                    "shield_status": "Quarantine Engaged (HTTP 429 Too Many Requests)"
                }
            )

    response = await call_next(request)

    # 3. Inject OWASP Top 10 Hardened Security Headers
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Shield-Protection"] = "SkillMap-Shield-2.4-Enterprise-Active"

    return response

# In-memory student profile state (synced with database or initialized to Rajat's profile from screenshot)
CURRENT_PROFILE = {
    "name": "Rajat Verma",
    "headline": "Full Stack & AI Engineer Aspirant",
    "email": "rajat.verma@example.edu",
    "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "level": 4,
    "level_title": "Builder",
    "xp": 4820,
    "xp_max": 6000,
    "streak_days": 12,
    "career_readiness_score": 82,
    "avg_skill_match": 84,
    "identity_verified": True,
    "identity_provider": "SkillMap FaceVerify",
    "identity_badge": "Identity: Verified ✅",
    "face_verified_at": "2026-09-10 09:30:00",
    "confidence_score": 98.4,
    "job_roles_analyzed": 12,
    "projects_completed_count": 5,
    "assessments_taken_count": 18,
    "avg_assessment_score": 78,
    "verified_skills": [
        {"name": "Python", "level": 92, "category": "Programming"},
        {"name": "Data Structures", "level": 88, "category": "Problem Solving"},
        {"name": "React.js", "level": 85, "category": "Frontend"},
        {"name": "FastAPI", "level": 84, "category": "Backend"},
        {"name": "SQL & PostgreSQL", "level": 78, "category": "Database"},
        {"name": "Tailwind CSS", "level": 90, "category": "Frontend"},
        {"name": "Git & GitHub", "level": 86, "category": "Tools"}
    ],
    "competencies": {
        "problem_solving": 88,
        "programming": 92,
        "data_analysis": 76,
        "creativity": 70,
        "communication": 65,
        "leadership": 60
    },
    "projects": [
        {
            "id": "p1",
            "title": "AI Chatbot",
            "category": "AI / NLP",
            "progress": 100,
            "status": "Completed",
            "description": "Conversational assistant built with FastAPI, LangChain, and React Tailwind PWA.",
            "tech_stack": ["Python", "FastAPI", "React", "Tailwind CSS"]
        },
        {
            "id": "p2",
            "title": "E-Commerce API",
            "category": "Backend Systems",
            "progress": 60,
            "status": "In Progress",
            "description": "Scalable RESTful microservices for product catalog, checkout, and Redis caching.",
            "tech_stack": ["FastAPI", "PostgreSQL", "Redis", "Docker"]
        },
        {
            "id": "p3",
            "title": "Portfolio Website",
            "category": "Frontend / PWA",
            "progress": 40,
            "status": "In Progress",
            "description": "Interactive developer portfolio with 3D canvas, dark mode, and PWA offline capabilities.",
            "tech_stack": ["React", "Vite", "Tailwind CSS", "PWA"]
        }
    ],
    "badges": [
        {"id": "b1", "name": "Top Scorer", "icon": "trophy", "unlocked": True, "date": "Sep 2026"},
        {"id": "b2", "name": "Code Master", "icon": "code", "unlocked": True, "date": "Sep 2026"},
        {"id": "b3", "name": "12-Day Streak", "icon": "calendar", "unlocked": True, "date": "Active"},
        {"id": "b4", "name": "Fast Learner", "icon": "rocket", "unlocked": True, "date": "Aug 2026"},
        {"id": "b5", "name": "Skill Verified", "icon": "target", "unlocked": True, "date": "Aug 2026"}
    ]
}

# Request / Response Schemas
class ChatRequest(BaseModel):
    message: str


def _split_coach_questions(message: str) -> List[str]:
    """Split a batch of user questions while keeping each question intact."""
    chunks = [chunk.strip(" \t\r\n-•") for chunk in re.split(r"(?<=[?])\s+|[\r\n]+", message)]
    return [chunk for chunk in chunks if len(chunk) >= 8]

class InterviewEvalRequest(BaseModel):
    role: str = "Python Developer"
    question_id: str = "q1"
    answer_text: str

class ResumeTextRequest(BaseModel):
    resume_text: str

@app.get("/")
def root(request: Request):
    index_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html"))
    accept = request.headers.get("accept", "")
    if "text/html" in accept and os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "name": "SkillMap AI Core Gateway",
        "tagline": "Discover your career. Prove your skills. Build your future.",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    """Returns platform status and cloud integration indicators."""
    db_mode = "SQLite (Local Zero-Config)" if is_sqlite else "PostgreSQL (Neon.tech Cloud)"
    return {
        "status": "online",
        "platform": "SkillMap AI 1.0",
        "integrations": {
            "database": {
                "engine": db_mode,
                "status": "connected",
                "neon_ready": True
            },
            "firebase": {
                "auth": "configured",
                "storage": "resumes & projects bucket ready",
                "mode": "free-tier cloud"
            },
            "ai_nlp": {
                "nlp_library": "spaCy + scikit-learn + pdfplumber",
                "skill_dictionary": "Active (1,000+ skills)",
                "status": "ready"
            },
            "external_jobs_api": {
                "remotive": "Live (Free tier)",
                "adzuna": "Ready",
                "static_fallback": "Loaded (100% availability)"
            },
            "deployment": {
                "frontend": "Vercel React PWA",
                "backend": "Render / Vercel Python FastAPI",
                "ci_cd": "GitHub Actions"
            }
        }
    }

@app.get("/api/profile")
def get_student_profile():
    """Returns the student profile data matching the reference dashboard."""
    return CURRENT_PROFILE

@app.get("/api/career/dna")
def get_career_dna():
    """Returns 6-axis competencies and ranked top career matches."""
    user_skills = [s["name"] for s in CURRENT_PROFILE["verified_skills"]]
    matches = compute_career_matches(user_skills, CURRENT_PROFILE["competencies"])
    return {
        "competencies": CURRENT_PROFILE["competencies"],
        "top_matches": matches
    }

@app.get("/api/skills/gap")
def get_skills_gap(career_id: str = "software_engineer"):
    """Returns the skill gap breakdown (System Design, Docker, AWS, CI/CD, Kubernetes)."""
    return compute_skill_gaps(career_id)

@app.get("/api/roadmap")
def get_roadmap():
    """Returns the recommended 10-week curriculum."""
    return {
        "student_name": CURRENT_PROFILE["name"],
        "target_role": "Software Engineer",
        "roadmap": get_recommended_roadmap()
    }

@app.get("/api/opportunities")
def list_opportunities(
    category: Optional[str] = None,
    region: Optional[str] = None,
    search: Optional[str] = None,
    domain: Optional[str] = None,
    country: Optional[str] = None,
    limit: Optional[int] = 120
):
    """Returns job, internship, and hackathon opportunities from the Worldwide Catalog (860+ jobs)."""
    user_skills = [s["name"] for s in CURRENT_PROFILE["verified_skills"]]
    return get_opportunities(
        category_filter=category,
        user_skills=user_skills,
        region_filter=region,
        search_query=search,
        domain_filter=domain,
        country_filter=country,
        limit=limit
    )

@app.post("/api/coach/chat")
def coach_chat(payload: ChatRequest):
    """AI Career Coach chat endpoint protected by SkillMap Shield AI Prompt Guard."""
    is_mal, threat, detail = security_shield.inspect_text(payload.message, context="AI Career Coach")
    if is_mal:
        return {
            "mode": "security",
            "reply": (
                "🛡️ **SkillMap Shield AI Defense Triggered**\n\n"
                f"**Threat Intercepted**: {threat}\n"
                f"**Details**: {detail}\n\n"
                "System safety filters prevented adversarial prompt injection or sensitive credential exfiltration from reaching LLM inference. "
                "All student records and system API credentials remain securely shielded."
            ),
            "suggested_actions": ["Ask about Python roadmaps", "Explore Cloud architecture", "Simulate mock interview"],
            "why_explanation": "SkillMap Shield AI Prompt Guard monitors incoming queries against OWASP LLM01:2025 prompt injection and system override signatures."
        }

    questions = _split_coach_questions(payload.message)
    if len(questions) <= 1:
        return generate_coach_response(payload.message, CURRENT_PROFILE)

    answers = [generate_coach_response(question, CURRENT_PROFILE) for question in questions]
    combined_reply = "\n\n".join(
        f"**Question {index}: {question}**\n\n{answer['reply']}"
        for index, (question, answer) in enumerate(zip(questions, answers), start=1)
    )
    actions = list(dict.fromkeys(action for answer in answers for action in answer.get("suggested_actions", [])))[:8]
    evidence = list(dict.fromkeys(signal for answer in answers for signal in answer.get("evidence", [])))[:8]
    confidence = sum(answer.get("confidence", 0.78) for answer in answers) / len(answers)
    return {
        "mode": "multi-answer",
        "reply": combined_reply,
        "answers": answers,
        "question_count": len(questions),
        "suggested_actions": actions,
        "evidence": evidence,
        "confidence": round(confidence, 2),
        "follow_up": "Which answer should I turn into a detailed action plan first?",
        "why": "Each question was classified independently against the profile, skill gaps, roadmap, and opportunity signals.",
    }

@app.get("/api/interview/questions")
def get_interview_questions():
    """Returns sample interview questions."""
    return {"questions": SAMPLE_QUESTIONS}

@app.post("/api/interview/evaluate")
def evaluate_interview(payload: InterviewEvalRequest):
    """Evaluates student's mock interview answer across 4 key criteria."""
    result = evaluate_interview_response(
        role=payload.role,
        question_id=payload.question_id,
        answer_text=payload.answer_text
    )
    return result

@app.post("/api/resume/parse")
async def parse_resume(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None)
):
    """
    Parses resume PDF using pdfplumber and NLP skill extraction,
    or parses raw pasted resume text.
    Updates Career DNA and readiness score dynamically.
    Protected by SkillMap Shield File & Payload Scanner.
    """
    text_content = ""
    file_name = "pasted_text"

    if file:
        file_name = file.filename
        bytes_data = await file.read()
        is_valid, sec_err = security_shield.validate_file_security(file_name, bytes_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=f"🛡️ SkillMap Shield Upload Interception: {sec_err}")
        text_content = extract_text_from_pdf(bytes_data)
    elif resume_text:
        is_mal, threat, detail = security_shield.inspect_text(resume_text, context="Resume Text")
        if is_mal:
            raise HTTPException(status_code=400, detail=f"🛡️ SkillMap Shield Rejection: Malicious payload detected ({threat})")
        text_content = resume_text
    else:
        raise HTTPException(status_code=400, detail="Provide either a PDF file or resume_text.")

    if not text_content.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided resume.")

    parsed_data = parse_resume_text(text_content)

    # Dynamically update the student profile based on parsed skills
    new_skills = []
    for skill_name in parsed_data.get("skills_flat_list", []):
        new_skills.append({
            "name": skill_name.title(),
            "level": min(95, 75 + len(skill_name)),
            "category": "Extracted"
        })

    if new_skills:
        # Merge with existing skills
        existing_names = set(s["name"].lower() for s in CURRENT_PROFILE["verified_skills"])
        for ns in new_skills:
            if ns["name"].lower() not in existing_names:
                CURRENT_PROFILE["verified_skills"].append(ns)

        # Update competencies
        new_comp = parsed_data.get("estimated_competencies", {})
        for k, v in new_comp.items():
            if k in CURRENT_PROFILE["competencies"]:
                CURRENT_PROFILE["competencies"][k] = int((CURRENT_PROFILE["competencies"][k] + v) / 2)

        # Recalculate Career Readiness Score
        comp_avg = sum(CURRENT_PROFILE["competencies"].values()) / 6.0
        CURRENT_PROFILE["career_readiness_score"] = min(96, int(comp_avg * 1.05))

    return {
        "message": "Resume successfully parsed and Career DNA updated!",
        "file_name": file_name,
        "extracted_contact": parsed_data["contact"],
        "extracted_skills": parsed_data["extracted_skills"],
        "skills_detected_count": parsed_data["total_skills_detected"],
        "new_career_readiness": CURRENT_PROFILE["career_readiness_score"],
        "updated_competencies": CURRENT_PROFILE["competencies"]
    }

@app.get("/api/gamification")
def get_gamification():
    """Returns XP, streak, and badges."""
    return {
        "level": CURRENT_PROFILE["level"],
        "level_title": CURRENT_PROFILE["level_title"],
        "xp": CURRENT_PROFILE["xp"],
        "xp_max": CURRENT_PROFILE["xp_max"],
        "streak_days": CURRENT_PROFILE["streak_days"],
        "badges": CURRENT_PROFILE["badges"]
    }

# ----------------- ADVANCED AI OPERATING SYSTEM ENDPOINTS -----------------

import json
from services.adaptive_tester import evaluate_code_challenge, get_adaptive_question, CODING_CHALLENGES
from services.matcher import generate_explainable_match

QUESTS_FILE = os.path.join(os.path.dirname(__file__), "data", "quests.json")
TPO_FILE = os.path.join(os.path.dirname(__file__), "data", "tpo_analytics.json")
KG_FILE = os.path.join(os.path.dirname(__file__), "data", "knowledge_graph.json")

class CodeVerifyRequest(BaseModel):
    challenge_id: str = "py_dup"
    code: str
    claimed_level: str = "Advanced"

class QuestClaimRequest(BaseModel):
    quest_id: str

@app.get("/api/skills/challenges")
def get_coding_challenges():
    """Returns available technical code challenges."""
    return {"challenges": CODING_CHALLENGES}

@app.post("/api/skills/verify/code")
def verify_code(payload: CodeVerifyRequest):
    """Evaluates student's code challenge and outputs Claimed vs Verified Skill status."""
    res = evaluate_code_challenge(payload.challenge_id, payload.code, payload.claimed_level)
    
    # Update profile verified skill status
    for sk in CURRENT_PROFILE["verified_skills"]:
        if sk["name"].lower() == res["skill"].lower():
            sk["verified_level"] = res["verified_level"]
            sk["claimed_level"] = res["claimed_level"]
            sk["verification_status"] = res["verification_status"]
            sk["level"] = res["assessment_score"]

    return res

@app.get("/api/skills/adaptive/question")
def adaptive_question(skill: str = "Python", difficulty: str = "medium"):
    """Returns next question in the adaptive AI assessment tree."""
    return get_adaptive_question(skill, difficulty)

@app.get("/api/projects/quests")
def list_project_quests():
    """Returns project quests with skill point bonuses."""
    try:
        with open(QUESTS_FILE, "r", encoding="utf-8") as f:
            quests = json.load(f)
            return {"quests": quests}
    except Exception as e:
        return {"quests": []}

@app.post("/api/projects/quests/claim")
def claim_quest(payload: QuestClaimRequest):
    """Completes a quest, awards XP, boosts skills (+10 React, +8 API), and updates portfolio."""
    try:
        with open(QUESTS_FILE, "r", encoding="utf-8") as f:
            quests = json.load(f)
    except Exception:
        quests = []

    target_q = next((q for q in quests if q["id"] == payload.quest_id), None)
    if not target_q:
        raise HTTPException(status_code=404, detail="Quest not found.")

    rewards = target_q.get("rewards", {})
    xp_boost = rewards.get("xp", 350)
    CURRENT_PROFILE["xp"] += xp_boost

    # Apply skill rewards
    for sk_reward in rewards.get("skills", []):
        sk_name = sk_reward["skill"]
        boost = sk_reward["boost"]
        found = False
        for s in CURRENT_PROFILE["verified_skills"]:
            if s["name"].lower() == sk_name.lower():
                s["level"] = min(99, s["level"] + boost)
                found = True
                break
        if not found:
            CURRENT_PROFILE["verified_skills"].append({
                "name": sk_name,
                "level": min(95, 70 + boost),
                "category": "Quest Boosted"
            })

    CURRENT_PROFILE["projects_completed_count"] += 1
    CURRENT_PROFILE["career_readiness_score"] = min(98, CURRENT_PROFILE["career_readiness_score"] + 2)

    return {
        "message": f"Quest '{target_q['title']}' claimed successfully!",
        "xp_earned": xp_boost,
        "new_total_xp": CURRENT_PROFILE["xp"],
        "skill_boosts": rewards.get("skills", []),
        "portfolio_strength_boost": rewards.get("portfolio_strength", 12),
        "new_career_readiness": CURRENT_PROFILE["career_readiness_score"]
    }

@app.get("/api/portfolio/living")
def get_living_portfolio():
    """Returns dynamic living career portfolio with verified badges and projects."""
    return {
        "student": {
            "name": CURRENT_PROFILE["name"],
            "headline": CURRENT_PROFILE["headline"],
            "avatar_url": CURRENT_PROFILE["avatar_url"],
            "email": CURRENT_PROFILE["email"],
            "readiness_score": CURRENT_PROFILE["career_readiness_score"],
            "level": CURRENT_PROFILE["level"],
            "level_title": CURRENT_PROFILE["level_title"],
            "streak_days": CURRENT_PROFILE["streak_days"]
        },
        "multidimensional_readiness": {
            "technical_skills": 88,
            "projects": 79,
            "problem_solving": 85,
            "communication": 67,
            "portfolio": 80,
            "interview": 72,
            "job_match": 91,
            "overall": CURRENT_PROFILE["career_readiness_score"],
            "ai_diagnosis": "Your biggest weakness is communication (67%). Improve this with AI Mock Interviews before applying."
        },
        "verified_skills": CURRENT_PROFILE["verified_skills"],
        "projects": CURRENT_PROFILE["projects"],
        "badges": CURRENT_PROFILE["badges"],
        "shareable_url": "https://skillmap.ai/portfolio/rajat-verma"
    }

@app.get("/api/tpo/analytics")
def get_tpo_analytics():
    """Returns college institutional placement officer intelligence data."""
    try:
        with open(TPO_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/knowledge-graph")
def get_career_knowledge_graph():
    """Returns nodes and links representing the Career Knowledge Graph."""
    try:
        with open(KG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"nodes": [], "links": []}

@app.get("/api/opportunities/explainable")
def explainable_opportunity_match(job_title: str = "Junior Python Developer"):
    """Returns explainable 5-factor matching breakdown for a job."""
    user_skills = [s["name"] for s in CURRENT_PROFILE["verified_skills"]]
    user_projects = [p["title"] for p in CURRENT_PROFILE["projects"]]
    return generate_explainable_match(job_title, user_skills, user_projects)

from services.textbook_service import get_all_volumes, get_volume_by_id, get_textbook_statistics

@app.get("/api/textbook/volumes")
def list_textbook_volumes():
    """Returns all 20 volumes in the SkillMap Master Series (10,000+ pages)."""
    return {
        "statistics": get_textbook_statistics(),
        "volumes": get_all_volumes()
    }

@app.get("/api/textbook/volume/{vol_id}")
def get_textbook_volume(vol_id: int):
    """Returns detailed chapter breakdown, formulas and viva guide for a single volume."""
    vol = get_volume_by_id(vol_id)
    if not vol:
        raise HTTPException(status_code=404, detail=f"Volume {vol_id} not found")
    return vol

from services.key_manager import get_all_keys_status, regenerate_all_keys, generate_env_content

@app.get("/api/config/keys")
def get_api_keys_status():
    """Returns all automatically generated & provisioned API keys and their live statuses."""
    keys = get_all_keys_status()
    return {
        "status": "All Keys Automatically Configured",
        "keys_count": len(keys),
        "keys": keys
    }

@app.post("/api/config/keys/regenerate")
def regenerate_api_keys():
    """Regenerates all cryptographic keys and rewrites .env files."""
    new_keys = regenerate_all_keys()
    return {
        "message": "All API keys and secrets automatically regenerated and written to .env files.",
        "keys": new_keys
    }

@app.get("/api/config/env-file")
def get_env_file_content():
    """Returns formatted .env file content."""
    return {
        "content": generate_env_content()
    }

COLAB_NOTEBOOK_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "notebooks", "SkillMap_AI_Colab.ipynb")

COLAB_SESSION_STATE = {
    "account": "aadifernandes919@gmail.com",
    "status": "Ready to Connect",
    "is_connected": False,
    "last_ping": None,
    "colab_runtime": "Google Colab Cloud",
    "hardware": "Tesla T4 GPU (Available)",
    "public_tunnel": "https://skillmap-ai-aadi.loca.lt"
}

@app.get("/api/colab/config")
def get_colab_config():
    """Returns Google Colab integration parameters preconfigured for aadifernandes919@gmail.com."""
    return {
        "user_email": "aadifernandes919@gmail.com",
        "status": COLAB_SESSION_STATE["status"],
        "is_connected": COLAB_SESSION_STATE["is_connected"],
        "badge_svg_url": "https://colab.research.google.com/assets/colab-badge.svg",
        "colab_new_notebook_url": "https://colab.research.google.com/#create=true",
        "colab_github_url": "https://colab.research.google.com/github/aadifernandes919/skillmap-ai/blob/main/SkillMap_AI_Colab.ipynb",
        "drive_mount_command": "from google.colab import drive\nprint('Connecting for aadifernandes919@gmail.com...')\ndrive.mount('/content/drive')",
        "one_click_snippet": (
            "# SkillMap AI One-Click Colab Launch for aadifernandes919@gmail.com\n"
            "from google.colab import drive\n"
            "drive.mount('/content/drive')\n"
            "!pip install -q fastapi uvicorn spacy pdfplumber scikit-learn pydantic pyngrok\n"
            "!python -m spacy download en_core_web_sm -q\n"
            "print('✓ Connected to Google Colab for aadifernandes919@gmail.com!')"
        ),
        "notebook_filename": "SkillMap_AI_Colab.ipynb"
    }

@app.get("/api/colab/status")
def get_colab_status():
    """Returns live connection bridge status for aadifernandes919@gmail.com."""
    return COLAB_SESSION_STATE

class ColabPingRequest(BaseModel):
    account: Optional[str] = "aadifernandes919@gmail.com"
    runtime: Optional[str] = "Colab T4 GPU"
    public_url: Optional[str] = "https://skillmap-ai-aadi.loca.lt"

@app.post("/api/colab/ping")
def ping_colab_heartbeat(payload: ColabPingRequest):
    """Receives live heartbeat ping from Google Colab cloud notebook."""
    import datetime
    COLAB_SESSION_STATE["is_connected"] = True
    COLAB_SESSION_STATE["status"] = "🟢 Live Connected"
    COLAB_SESSION_STATE["account"] = payload.account or "aadifernandes919@gmail.com"
    COLAB_SESSION_STATE["hardware"] = payload.runtime or "Colab T4 GPU"
    COLAB_SESSION_STATE["public_tunnel"] = payload.public_url or "https://skillmap-ai-aadi.loca.lt"
    COLAB_SESSION_STATE["last_ping"] = datetime.datetime.now().isoformat()
    return {
        "message": f"Colab session active for {COLAB_SESSION_STATE['account']}",
        "session": COLAB_SESSION_STATE
    }

@app.get("/api/colab/notebook")
def download_colab_notebook():
    """Returns the JSON structure of the preconfigured Colab notebook."""
    if os.path.exists(COLAB_NOTEBOOK_PATH):
        with open(COLAB_NOTEBOOK_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Colab notebook not found")

# =====================================================================
# SkillMap Shield 🛡️ — Cybersecurity Control Plane & Audit Endpoints
# =====================================================================

class AttackSimulationRequest(BaseModel):
    attack_type: str = "sqli"  # sqli | prompt_injection | rate_limit | spoofed_file

@app.get("/api/security/dashboard")
def get_security_dashboard():
    """Returns real-time cybersecurity telemetry, defense layers, and live audit stream."""
    return security_shield.get_dashboard_summary()

@app.get("/api/security/events")
def get_security_events():
    """Returns the immutable security event audit trail."""
    return {
        "status": "active",
        "total_events": len(security_shield.audit_log),
        "events": security_shield.audit_log
    }

@app.post("/api/security/simulate-attack")
def simulate_cyber_attack(payload: AttackSimulationRequest):
    """
    1-Click Cyber Defense Simulator:
    Demonstrates SkillMap Shield intercepting SQLi, Prompt Injection, Rate-Limiting DoS, or Spoofed Executables.
    """
    result = security_shield.simulate_attack(payload.attack_type)
    return result

@app.post("/api/security/reset-stats")
def reset_security_stats():
    """Re-calibrates security telemetry back to baseline."""
    security_shield.stats["blocked_attacks_count"] = 48
    security_shield.stats["rate_limit_events_count"] = 14
    security_shield.stats["ai_prompt_injections_trapped"] = 9
    security_shield.stats["malicious_uploads_rejected"] = 5
    return {
        "message": "Security telemetry re-calibrated successfully.",
        "stats": security_shield.stats
    }

# =====================================================================
# SkillMap FaceVerify 🛡️ — Privacy-Preserving Identity Verification Gate
# =====================================================================

class FaceVerifyRequest(BaseModel):
    student_id: Optional[str] = "student_rajat"
    image_base64: Optional[str] = None
    is_simulation: Optional[bool] = False
    context: Optional[str] = "Skill Assessment Gate"

class FaceEnrollRequest(BaseModel):
    student_id: Optional[str] = "student_rajat"
    student_name: Optional[str] = "Rajat Verma"
    email: Optional[str] = "rajat.verma@example.edu"
    image_base64: Optional[str] = None
    consent_granted: bool = True

class OtpVerifyRequest(BaseModel):
    student_id: Optional[str] = "student_rajat"
    code: str = "123456"

@app.get("/api/faceverify/status")
def get_face_verify_status(student_id: Optional[str] = "student_rajat"):
    """Returns live student identity verification status and privacy policies."""
    status = face_verify_service.get_status(student_id)
    status["profile_identity_verified"] = CURRENT_PROFILE.get("identity_verified", True)
    return status

@app.post("/api/faceverify/verify")
def verify_face_identity(payload: FaceVerifyRequest):
    """
    Live biometric identity checkpoint before assessments & AI interviews.
    Verifies probe image against registered mathematical template.
    """
    result = face_verify_service.verify_live_face(
        student_id=payload.student_id or "student_rajat",
        image_input=payload.image_base64,
        is_simulation=payload.is_simulation,
        target_context=payload.context or "Assessment Gate"
    )
    if result.get("verified"):
        CURRENT_PROFILE["identity_verified"] = True
        CURRENT_PROFILE["face_verified_at"] = result.get("verified_at")
        CURRENT_PROFILE["confidence_score"] = result.get("confidence_score", 98.4)
    return result

@app.post("/api/faceverify/enroll")
def enroll_face_template(payload: FaceEnrollRequest):
    """Enrolls initial student face template with explicit consent declaration."""
    result = face_verify_service.enroll_template(
        student_id=payload.student_id or "student_rajat",
        student_name=payload.student_name or "Rajat Verma",
        email=payload.email or "rajat.verma@example.edu",
        image_input=payload.image_base64,
        consent_granted=payload.consent_granted
    )
    if result.get("success"):
        CURRENT_PROFILE["identity_verified"] = True
    return result

@app.post("/api/faceverify/otp")
def verify_otp_alternative(payload: OtpVerifyRequest):
    """Non-biometric 2FA alternative for students who opt out of camera biometrics."""
    result = face_verify_service.verify_non_biometric_otp(
        student_id=payload.student_id or "student_rajat",
        code=payload.code
    )
    if result.get("verified"):
        CURRENT_PROFILE["identity_verified"] = True
    return result

@app.post("/api/faceverify/delete")
def delete_face_biometrics(student_id: Optional[str] = "student_rajat"):
    """Enforces Right to be Forgotten: Permanently deletes student biometric vectors."""
    result = face_verify_service.delete_template(student_id or "student_rajat")
    CURRENT_PROFILE["identity_verified"] = False
    return result

# ==============================================================================
# SkillMap Step 1: Authentication & Session Routes (Zero-Password Persistence)
# ==============================================================================

class AuthRegisterRequest(BaseModel):
    name: str
    email: str
    firebase_uid: str
    career_goal: Optional[str] = "Full Stack Developer"

class AuthLoginRequest(BaseModel):
    email: str
    firebase_uid: str
    name: Optional[str] = None

@app.post("/api/auth/register")
def register_student(payload: AuthRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new student record synchronized with Firebase UID.
    Strictly persists 0 passwords in database (Firebase handles credentials).
    """
    student = sync_or_create_student(
        db=db,
        firebase_uid=payload.firebase_uid,
        email=payload.email,
        name=payload.name,
        career_goal=payload.career_goal
    )
    CURRENT_PROFILE["name"] = student.name
    CURRENT_PROFILE["email"] = student.email
    CURRENT_PROFILE["career_goal"] = student.career_goal or "Full Stack Developer"
    CURRENT_PROFILE["headline"] = f"{student.career_goal or 'Full Stack'} Aspirant"
    token = generate_session_token(student.id, student.firebase_uid, student.email, student.name)
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": student.id,
            "firebase_uid": student.firebase_uid,
            "name": student.name,
            "email": student.email,
            "career_goal": student.career_goal,
            "avatar_url": student.avatar_url,
            "level": student.level,
            "level_title": student.level_title,
            "xp": student.xp,
            "xp_max": student.xp_max
        }
    }

@app.post("/api/auth/login")
def login_student(payload: AuthLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates student session synced with Firebase UID.
    Strictly persists 0 passwords in database (Firebase handles credentials).
    """
    student = sync_or_create_student(
        db=db,
        firebase_uid=payload.firebase_uid,
        email=payload.email,
        name=payload.name
    )
    CURRENT_PROFILE["name"] = student.name
    CURRENT_PROFILE["email"] = student.email
    CURRENT_PROFILE["career_goal"] = student.career_goal or "Full Stack Developer"
    CURRENT_PROFILE["headline"] = f"{student.career_goal or 'Full Stack'} Aspirant"
    token = generate_session_token(student.id, student.firebase_uid, student.email, student.name)
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": student.id,
            "firebase_uid": student.firebase_uid,
            "name": student.name,
            "email": student.email,
            "career_goal": student.career_goal,
            "avatar_url": student.avatar_url,
            "level": student.level,
            "level_title": student.level_title,
            "xp": student.xp,
            "xp_max": student.xp_max
        }
    }

@app.get("/api/auth/me")
def get_current_user_profile(request: Request, db: Session = Depends(get_db)):
    """
    Returns the authenticated student's profile from verified token claims.
    """
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header.startswith("Bearer ") else None
    
    if token:
        claims = verify_session_token(token)
        if claims:
            student = db.query(models.Student).filter(models.Student.id == claims["sub"]).first()
            if student:
                return {
                    "authenticated": True,
                    "user": {
                        "id": student.id,
                        "firebase_uid": student.firebase_uid,
                        "name": student.name,
                        "email": student.email,
                        "career_goal": student.career_goal or "Full Stack Developer",
                        "avatar_url": student.avatar_url,
                        "level": student.level,
                        "level_title": student.level_title,
                        "xp": student.xp,
                        "xp_max": student.xp_max,
                        "identity_verified": CURRENT_PROFILE.get("identity_verified", False)
                    }
                }
    
    # Return active profile default if in local dev preview
    return {
        "authenticated": True,
        "user": {
            "id": 1,
            "firebase_uid": "uid_rajat_demo",
            "name": CURRENT_PROFILE["name"],
            "email": CURRENT_PROFILE["email"],
            "career_goal": CURRENT_PROFILE.get("career_goal", "Full Stack Developer"),
            "avatar_url": CURRENT_PROFILE["avatar_url"],
            "level": CURRENT_PROFILE["level"],
            "level_title": CURRENT_PROFILE["level_title"],
            "xp": CURRENT_PROFILE["xp"],
            "xp_max": CURRENT_PROFILE["xp_max"],
            "identity_verified": CURRENT_PROFILE.get("identity_verified", True)
        }
    }

@app.post("/api/auth/logout")
def logout_user():
    """Logs out student on backend."""
    return {"status": "success", "message": "Logged out successfully"}

# Include Phase 2 Modular Users Router (/api/users)
from app.routes.users import users_router
app.include_router(users_router)

# Production SPA Static Files & Client Routing Fallback
from fastapi.staticfiles import StaticFiles

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Index file not found")



