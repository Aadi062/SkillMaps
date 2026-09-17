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
    career_goal: Optional[str] = None
    avatar_url: Optional[str] = None

@users_router.get("/profile")
def get_profile(request: Request, db: Session = Depends(get_db)):
    """Returns the authenticated student profile details."""
    claims = get_current_user_claims()
    student = None
    if claims:
        student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()
    if not student:
        student = db.query(models.Student).first()

    if not student:
        return {
            "name": "Rajat Verma",
            "email": "rajat.verma@example.edu",
            "career_goal": "Full Stack Developer",
            "level": 4,
            "level_title": "Builder",
            "xp": 4820,
            "xp_max": 6000,
            "career_readiness_score": 82
        }

    return {
        "id": student.id,
        "firebase_uid": student.firebase_uid,
        "name": student.name,
        "email": student.email,
        "career_goal": student.career_goal,
        "avatar_url": student.avatar_url,
        "level": student.level,
        "level_title": student.level_title,
        "xp": student.xp,
        "xp_max": student.xp_max,
        "career_readiness_score": student.career_readiness_score,
        "streak_days": student.streak_days
    }

@users_router.put("/profile")
def update_profile(payload: ProfileUpdatePayload, request: Request, db: Session = Depends(get_db)):
    """Updates student profile fields (name, career_goal, avatar_url)."""
    claims = get_current_user_claims()
    student = None
    if claims:
        student = db.query(models.Student).filter(models.Student.id == claims.get("sub")).first()
    if not student:
        student = db.query(models.Student).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")

    if payload.name:
        student.name = payload.name
    if payload.career_goal:
        student.career_goal = payload.career_goal
    if payload.avatar_url:
        student.avatar_url = payload.avatar_url

    db.commit()
    db.refresh(student)
    return {
        "status": "success",
        "message": "Profile updated successfully",
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "career_goal": student.career_goal,
            "avatar_url": student.avatar_url
        }
    }
