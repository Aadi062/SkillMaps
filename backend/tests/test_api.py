import pytest
import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from services.nlp_parser import parse_resume_text
from services.matcher import compute_career_matches, compute_skill_gaps

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "database" in data["integrations"]
    assert "ai_nlp" in data["integrations"]

def test_get_profile():
    response = client.get("/api/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Rajat Verma"
    assert data["career_readiness_score"] == 82
    assert data["avg_skill_match"] == 84
    assert data["level_title"] == "Builder"

def test_career_dna():
    response = client.get("/api/career/dna")
    assert response.status_code == 200
    data = response.json()
    assert "competencies" in data
    assert data["competencies"]["programming"] == 92
    assert len(data["top_matches"]) > 0
    top_career = data["top_matches"][0]
    assert top_career["id"] == "software_engineer"
    assert top_career["match_score"] >= 85

def test_skills_gap():
    response = client.get("/api/skills/gap")
    assert response.status_code == 200
    data = response.json()
    gaps = data["gaps"]
    assert len(gaps) >= 5
    system_design_gap = next((g for g in gaps if g["skill"] == "System Design"), None)
    assert system_design_gap is not None
    assert system_design_gap["current_level"] == 40
    assert system_design_gap["required_level"] == 80
    assert system_design_gap["gap"] == 40

def test_ai_career_coach():
    response = client.post("/api/coach/chat", json={"message": "What should I learn this month to get an internship?"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "Data Structures" in data["reply"]
    assert len(data["suggested_actions"]) > 0

def test_interview_evaluator():
    response = client.post("/api/interview/evaluate", json={
        "role": "Python Developer",
        "question_id": "q1",
        "answer_text": "Python manages memory using reference counting and a cyclic garbage collector with generational pools."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["overall_score"] > 60
    assert "metrics" in data
    assert "technical" in data["metrics"]
    assert "communication" in data["metrics"]
    assert "confidence" in data["metrics"]
    assert "completeness" in data["metrics"]

def test_opportunities():
    response = client.get("/api/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert "opportunities" in data

def test_resume_parser_service():
    sample_resume = """
    Rajat Verma
    Email: rajat@example.com
    GitHub: github.com/rajatverma
    Skills: Python, FastAPI, React.js, Docker, SQL, Git, Data Structures & Algorithms.
    Experience: Developed full stack web applications and REST APIs.
    """
    result = parse_resume_text(sample_resume)
    assert result["contact"]["email"] == "rajat@example.com"
    assert "python" in result["skills_flat_list"]
    assert "fastapi" in result["skills_flat_list"]
    assert result["total_skills_detected"] >= 4

def test_code_skill_verification():
    code_solution = """
def find_duplicates(nums):
    seen = set()
    duplicates = set()
    for n in nums:
        if n in seen:
            duplicates.add(n)
        else:
            seen.add(n)
    return list(duplicates)
    """
    response = client.post("/api/skills/verify/code", json={
        "challenge_id": "py_dup",
        "code": code_solution,
        "claimed_level": "Advanced"
    })
    assert response.status_code == 200
    data = response.json()
    assert "verified_level" in data
    assert data["assessment_score"] >= 75
    assert data["verification_status"] == "Verified"

def test_project_quests_and_claim():
    # 1. Fetch quests
    res_list = client.get("/api/projects/quests")
    assert res_list.status_code == 200
    quests = res_list.json()["quests"]
    assert len(quests) > 0

    # 2. Claim quest
    claim_res = client.post("/api/projects/quests/claim", json={"quest_id": "quest_01"})
    assert claim_res.status_code == 200
    data = claim_res.json()
    assert data["xp_earned"] == 350
    assert len(data["skill_boosts"]) > 0

def test_living_portfolio():
    res = client.get("/api/portfolio/living")
    assert res.status_code == 200
    data = res.json()
    assert "student" in data
    assert "multidimensional_readiness" in data
    assert "verified_skills" in data

def test_tpo_analytics():
    res = client.get("/api/tpo/analytics")
    assert res.status_code == 200
    data = res.json()
    assert data["total_students_tracked"] == 2500
    assert data["cohort_readiness_distribution"]["career_ready_pct"] == 42

def test_career_knowledge_graph():
    res = client.get("/api/knowledge-graph")
    assert res.status_code == 200
    data = res.json()
    assert len(data["nodes"]) > 0
    assert len(data["links"]) > 0

def test_explainable_opportunity_match():
    res = client.get("/api/opportunities/explainable?job_title=Junior%20Python%20Developer")
    assert res.status_code == 200
    data = res.json()
    assert "factors" in data
    assert "missing_skills" in data
    assert "why_recommended" in data

def test_textbook_catalog():
    res = client.get("/api/textbook/volumes")
    assert res.status_code == 200
    data = res.json()
    assert "statistics" in data
    assert data["statistics"]["total_volumes"] == 20
    assert data["statistics"]["total_pages"] >= 10000
    assert len(data["volumes"]) == 20

def test_textbook_volume_detail():
    res = client.get("/api/textbook/volume/1")
    assert res.status_code == 200
    vol = res.json()
    assert vol["id"] == 1
    assert "Foundations" in vol["title"]
    assert len(vol["chapters"]) >= 5
    assert "key_formula" in vol
    assert "viva_sample" in vol

def test_auto_api_keys():
    res = client.get("/api/config/keys")
    assert res.status_code == 200
    data = res.json()
    assert data["keys_count"] >= 15
    assert "keys" in data
    secret_keys = [k for k in data["keys"] if k["is_secret"]]
    assert len(secret_keys) > 0
    # Verify values are masked
    for sk in secret_keys:
        if not sk["key"].startswith("DATABASE_URL"):
            assert "••" in sk["masked_value"]

def test_regenerate_api_keys():
    res = client.post("/api/config/keys/regenerate")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert len(data["keys"]) >= 15

def test_env_file_endpoint():
    res = client.get("/api/config/env-file")
    assert res.status_code == 200
    content = res.json()["content"]
    assert "SKILLMAP AI" in content
    assert "SECRET_KEY=" in content
    assert "FIREBASE_API_KEY=" in content
    assert "GEMINI_API_KEY=" in content

def test_colab_config():
    res = client.get("/api/colab/config")
    assert res.status_code == 200
    data = res.json()
    assert data["user_email"] == "aadifernandes919@gmail.com"
    assert "drive_mount_command" in data
    assert "one_click_snippet" in data

def test_colab_notebook_download():
    res = client.get("/api/colab/notebook")
    assert res.status_code == 200
    nb = res.json()
    assert "cells" in nb
    assert len(nb["cells"]) >= 5
    assert nb["metadata"]["colab"]["authorship_tag"] == "aadifernandes919@gmail.com"




