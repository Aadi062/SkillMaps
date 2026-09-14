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

def get_opportunities(
    category_filter: Optional[str] = None,
    user_skills: Optional[List[str]] = None,
    region_filter: Optional[str] = None,
    search_query: Optional[str] = None,
    domain_filter: Optional[str] = None,
    country_filter: Optional[str] = None,
    limit: Optional[int] = 120
) -> Dict[str, Any]:
    """
    Returns aggregated opportunities from the Worldwide Job Catalog (860+ jobs) + Remotive live API.
    Provides multi-region, multi-country, multi-domain, and search filtering with personalized scoring.
    """
    fallback_jobs = load_fallback_jobs()
    live_jobs = fetch_remotive_jobs(limit=5)
    combined = live_jobs + fallback_jobs

    user_skills_set = set([s.lower() for s in (user_skills or ["python", "react", "sql", "git", "docker"])])

    # Extract all distinct regions, domains, and countries for UI filters
    all_regions = set()
    all_domains = set()
    all_countries = set()

    for job in combined:
        r = job.get("region")
        if r:
            all_regions.add(r)
        d = job.get("category")
        if d:
            all_domains.add(d)
        c = job.get("country")
        if c:
            all_countries.add(c)

        req_skills = set([s.lower() for s in job.get("skills_required", [])])
        if req_skills:
            overlap = len(user_skills_set.intersection(req_skills))
            score = int(62 + (overlap / len(req_skills)) * 36)
            if "match_score" in job and not user_skills:
                pass
            else:
                job["match_score"] = min(98, max(68, score))

    filtered = combined

    # 1. Category Filter (Jobs, Internships, Hackathons, Remote, etc.)
    if category_filter and category_filter.lower() != "all":
        filt = category_filter.lower()
        filtered = [
            j for j in filtered
            if filt in j.get("type", "").lower() or filt in j.get("category", "").lower() or filt in [t.lower() for t in j.get("tags", [])]
        ]

    # 2. Region Filter (North America, Europe, Asia-Pacific, Middle East, Latin America, Global Remote)
    if region_filter and region_filter.lower() not in ["all", "all regions"]:
        r_filt = region_filter.lower()
        filtered = [
            j for j in filtered
            if r_filt in j.get("region", "").lower()
        ]

    # 3. Domain Filter (Software Engineering, AI & Machine Learning, etc.)
    if domain_filter and domain_filter.lower() not in ["all", "all domains"]:
        d_filt = domain_filter.lower()
        filtered = [
            j for j in filtered
            if d_filt in j.get("category", "").lower()
        ]

    # 4. Country Filter
    if country_filter and country_filter.lower() not in ["all", "all countries"]:
        c_filt = country_filter.lower()
        filtered = [
            j for j in filtered
            if c_filt in j.get("country", "").lower()
        ]

    # 5. Search Query (Title, Company, Location, Skill, Tags)
    if search_query and search_query.strip():
        q = search_query.lower().strip()
        filtered = [
            j for j in filtered
            if q in j.get("title", "").lower() or
               q in j.get("company", "").lower() or
               q in j.get("location", "").lower() or
               q in j.get("country", "").lower() or
               any(q in s.lower() for s in j.get("skills_required", [])) or
               any(q in t.lower() for t in j.get("tags", []))
        ]

    # Sort descending by match score
    filtered.sort(key=lambda x: x.get("match_score", 70), reverse=True)

    total_matched = len(filtered)
    displayed_items = filtered[:limit] if limit else filtered

    return {
        "total_worldwide_jobs": len(combined),
        "count": total_matched,
        "displayed_count": len(displayed_items),
        "regions": sorted(list(all_regions)),
        "domains": sorted(list(all_domains)),
        "countries": sorted(list(all_countries)),
        "opportunities": displayed_items
    }

