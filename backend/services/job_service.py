import os
import json
import requests
from typing import List, Dict, Any, Optional

MOCK_JOBS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mock_jobs.json")

def load_fallback_jobs() -> List[Dict[str, Any]]:
    try:
        with open(MOCK_JOBS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading mock_jobs.json: {e}")
        return []

def fetch_remotive_jobs(limit: int = 5) -> List[Dict[str, Any]]:
    """Fetches real live remote developer jobs from free Remotive API."""
    url = "https://remotive.com/api/remote-jobs?category=software-dev&limit=" + str(limit)
    try:
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            data = response.json()
            jobs = []
            for j in data.get("jobs", [])[:limit]:
                jobs.append({
                    "id": f"remotive_{j.get('id')}",
                    "title": j.get("title"),
                    "company": j.get("company_name"),
                    "location": j.get("candidate_required_location", "Remote"),
                    "type": j.get("job_type", "Full-time"),
                    "category": "Software Engineering",
                    "stipend": j.get("salary") or "Competitive / Disclosed on interview",
                    "match_score": 85,
                    "tags": [t for t in j.get("tags", [])[:5] if t],
                    "description": j.get("description", "")[:200] + "...",
                    "source": "Remotive API (Live)",
                    "apply_url": j.get("url"),
                    "skills_required": ["python", "react", "git", "rest api"]
                })
            return jobs
    except Exception as e:
        print(f"Remotive API request skipped or failed: {e}")
    return []

def get_opportunities(category_filter: Optional[str] = None, user_skills: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Returns aggregated opportunities from Remotive API + static curated opportunities.
    Computes personalized match score based on user skills.
    """
    fallback_jobs = load_fallback_jobs()
    
    # Try fetching Remotive live jobs
    live_jobs = fetch_remotive_jobs(limit=3)
    combined = live_jobs + fallback_jobs

    user_skills_set = set([s.lower() for s in (user_skills or ["python", "react", "sql", "git", "docker"])])

    for job in combined:
        req_skills = set([s.lower() for s in job.get("skills_required", [])])
        if req_skills:
            overlap = len(user_skills_set.intersection(req_skills))
            # Calculate dynamic score with base
            score = int(60 + (overlap / len(req_skills)) * 38)
            # Retain original calibration if close
            if "match_score" in job and not user_skills:
                pass
            else:
                job["match_score"] = min(98, max(65, score))

    if category_filter and category_filter.lower() != "all":
        filt = category_filter.lower()
        combined = [
            j for j in combined
            if filt in j.get("type", "").lower() or filt in j.get("category", "").lower() or filt in [t.lower() for t in j.get("tags", [])]
        ]

    # Sort descending by match score
    combined.sort(key=lambda x: x.get("match_score", 70), reverse=True)
    return combined
