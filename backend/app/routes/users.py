"""
SkillMap AI - Student Profile & Users Routes (/api/users)
Phase 2 Foundation: Profile details, career readiness, and learning metrics.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
import models
from database import get_db
from app.middleware.auth import get_current_user_claims

users_router = APIRouter(prefix="/api/users", tags=["Users & Profiles"])

class ProfileUpdatePayload(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None
    location: Optional[str] = None
    career_goal: Optional[str] = None
    target_role: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None

@users_router.get("/profile")
def get_profile(request: Request, db: Session = Depends(get_db)):
    """Returns the authenticated student profile details."""
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header.startswith("Bearer ") else None
    
    student = None
    if token:
        from services.auth_service import verify_session_token
        claims = verify_session_token(token)
        if claims:
            student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()
    
    if not student:
        claims = get_current_user_claims()
        if claims:
            student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()

    if not student:
        student = db.query(models.Student).first()

    if not student:
        return {
            "name": "Rajat Verma",
            "email": "rajat.verma@example.edu",
            "career_goal": "Full Stack Developer",
            "headline": "Full Stack & AI Engineer Aspirant",
            "bio": "Passionate computer science student building real-world AI and web applications.",
            "college": "Indian Institute of Technology",
            "degree": "B.Tech Computer Science & Engineering",
            "graduation_year": 2027,
            "cgpa": 8.8,
            "location": "Bengaluru, India",
            "target_role": "Full Stack Developer",
            "github_url": "https://github.com/Aadi062",
            "linkedin_url": "https://linkedin.com/in/rajat-verma",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "level": 4,
            "level_title": "Builder",
            "xp": 4820,
            "xp_max": 6000,
            "career_readiness_score": 82,
            "streak_days": 12
        }

    return {
        "id": student.id,
        "firebase_uid": student.firebase_uid,
        "name": student.name,
        "email": student.email,
        "headline": getattr(student, "headline", "Full Stack & AI Engineer Aspirant") or "Full Stack Aspirant",
        "bio": getattr(student, "bio", "") or "Passionate computer science student building real-world AI and web applications.",
        "college": getattr(student, "college", "") or "Indian Institute of Technology",
        "degree": getattr(student, "degree", "") or "B.Tech Computer Science & Engineering",
        "graduation_year": getattr(student, "graduation_year", 2027) or 2027,
        "cgpa": getattr(student, "cgpa", 8.8) or 8.8,
        "location": getattr(student, "location", "Bengaluru, India") or "Bengaluru, India",
        "career_goal": student.career_goal or "Full Stack Developer",
        "target_role": getattr(student, "target_role", student.career_goal) or "Full Stack Developer",
        "github_url": getattr(student, "github_url", "https://github.com/Aadi062") or "https://github.com/Aadi062",
        "linkedin_url": getattr(student, "linkedin_url", "https://linkedin.com/in/rajat-verma") or "https://linkedin.com/in/rajat-verma",
        "avatar_url": student.avatar_url or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        "level": student.level or 4,
        "level_title": student.level_title or "Builder",
        "xp": student.xp or 4820,
        "xp_max": student.xp_max or 6000,
        "career_readiness_score": student.career_readiness_score or 82,
        "streak_days": student.streak_days or 12,
        "competencies": {
            "problem_solving": student.problem_solving or 88,
            "programming": student.programming or 92,
            "data_analysis": student.data_analysis or 76,
            "creativity": student.creativity or 70,
            "communication": student.communication or 65,
            "leadership": student.leadership or 60
        }
    }

@users_router.put("/profile")
def update_profile(payload: ProfileUpdatePayload, request: Request, db: Session = Depends(get_db)):
    """Updates student profile fields (name, headline, bio, college, degree, etc)."""
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() if auth_header.startswith("Bearer ") else None
    
    student = None
    if token:
        from services.auth_service import verify_session_token
        claims = verify_session_token(token)
        if claims:
            student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()

    if not student:
        claims = get_current_user_claims()
        if claims:
            student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()

    if not student:
        student = db.query(models.Student).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")

    if payload.name is not None:
        student.name = payload.name
    if payload.headline is not None:
        student.headline = payload.headline
    if payload.bio is not None:
        student.bio = payload.bio
    if payload.college is not None:
        student.college = payload.college
    if payload.degree is not None:
        student.degree = payload.degree
    if payload.graduation_year is not None:
        student.graduation_year = payload.graduation_year
    if payload.cgpa is not None:
        student.cgpa = payload.cgpa
    if payload.location is not None:
        student.location = payload.location
    if payload.career_goal is not None:
        student.career_goal = payload.career_goal
    if payload.target_role is not None:
        student.target_role = payload.target_role
    if payload.github_url is not None:
        student.github_url = payload.github_url
    if payload.linkedin_url is not None:
        student.linkedin_url = payload.linkedin_url
    if payload.avatar_url is not None:
        student.avatar_url = payload.avatar_url

    db.commit()
    db.refresh(student)

    # Sync with main.py CURRENT_PROFILE
    try:
        import main
        main.CURRENT_PROFILE["name"] = student.name
        if payload.headline:
            main.CURRENT_PROFILE["headline"] = student.headline
        if payload.career_goal:
            main.CURRENT_PROFILE["career_goal"] = student.career_goal
    except Exception:
        pass

    return {
        "status": "success",
        "message": "Student profile updated successfully",
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "headline": student.headline,
            "bio": student.bio,
            "college": student.college,
            "degree": student.degree,
            "graduation_year": student.graduation_year,
            "cgpa": student.cgpa,
            "location": student.location,
            "career_goal": student.career_goal,
            "target_role": student.target_role,
            "github_url": student.github_url,
            "linkedin_url": student.linkedin_url,
            "avatar_url": student.avatar_url,
            "level": student.level,
            "xp": student.xp,
            "career_readiness_score": student.career_readiness_score
        }
    }
