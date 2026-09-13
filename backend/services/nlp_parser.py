import os
import re
import json
from typing import Dict, List, Any, Optional
import io
import pdfplumber

SKILLS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "skills.json")

def load_skills_data() -> Dict[str, Any]:
    try:
        with open(SKILLS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading skills.json: {e}")
        return {"categories": {}, "skill_aliases": {}}

SKILLS_DATA = load_skills_data()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from PDF bytes using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber extraction error: {e}")
        # Fallback decode if it's plaintext
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            text = ""
    return text

def parse_resume_text(text: str) -> Dict[str, Any]:
    """
    Parses resume text using NLP & Skill Taxonomy matching.
    Extracts:
    - Identified skills categorized by domain
    - Email, phone, links (GitHub, LinkedIn)
    - Experience keywords & education
    - Estimated competency score updates
    """
    cleaned_text = text.lower()
    
    # 1. Extract contact information
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    github_match = re.search(r"github\.com/[\w-]+", text, re.IGNORECASE)
    linkedin_match = re.search(r"linkedin\.com/in/[\w-]+", text, re.IGNORECASE)

    extracted_email = email_match.group(0) if email_match else None
    extracted_phone = phone_match.group(0) if phone_match else None
    extracted_github = f"https://{github_match.group(0)}" if github_match else None
    extracted_linkedin = f"https://{linkedin_match.group(0)}" if linkedin_match else None

    # 2. Skill matching against skills.json taxonomy
    categories = SKILLS_DATA.get("categories", {})
    aliases = SKILLS_DATA.get("skill_aliases", {})

    found_skills: Dict[str, List[str]] = {}
    all_found_skills: set = set()

    for category, skill_list in categories.items():
        found_in_category = []
        for skill in skill_list:
            # Word boundary regex search to avoid substring collisions (e.g. 'c' in 'css')
            escaped_skill = re.escape(skill)
            pattern = rf"(?<![\w\+]){escaped_skill}(?![\w\+])"
            if re.search(pattern, cleaned_text):
                canonical_name = aliases.get(skill, skill)
                if canonical_name not in all_found_skills:
                    found_in_category.append(canonical_name)
                    all_found_skills.add(canonical_name)
        if found_in_category:
            found_skills[category] = found_in_category

    # 3. Estimate Career Competencies based on extracted skills
    prog_count = len(found_skills.get("programming", [])) + len(found_skills.get("backend", [])) + len(found_skills.get("frontend", []))
    data_count = len(found_skills.get("data_ai", [])) + len(found_skills.get("database", []))
    sys_count = len(found_skills.get("system_design", [])) + len(found_skills.get("cloud_devops", []))

    # Base baseline scores adjusted by skills found
    programming_score = min(98, 65 + (prog_count * 4))
    problem_solving_score = min(95, 70 + (len(all_found_skills) * 2))
    data_analysis_score = min(96, 55 + (data_count * 6))
    creativity_score = min(90, 60 + len(found_skills.get("frontend", [])) * 5)
    communication_score = 68 if "communication" in cleaned_text or "team" in cleaned_text else 62
    leadership_score = 65 if "lead" in cleaned_text or "president" in cleaned_text or "manager" in cleaned_text else 58

    # 4. Education & Experience extraction hints
    education = []
    if "bachelor" in cleaned_text or "b.tech" in cleaned_text or "bs " in cleaned_text:
        education.append("Bachelor of Technology / Computer Science")
    if "master" in cleaned_text or "m.tech" in cleaned_text or "ms " in cleaned_text:
        education.append("Master of Science")
    if not education:
        education.append("Undergraduate Engineering")

    return {
        "contact": {
            "email": extracted_email,
            "phone": extracted_phone,
            "github": extracted_github,
            "linkedin": extracted_linkedin
        },
        "extracted_skills": found_skills,
        "total_skills_detected": len(all_found_skills),
        "skills_flat_list": sorted(list(all_found_skills)),
        "education": education,
        "estimated_competencies": {
            "problem_solving": problem_solving_score,
            "programming": programming_score,
            "data_analysis": data_analysis_score,
            "creativity": creativity_score,
            "communication": communication_score,
            "leadership": leadership_score
        }
    }
