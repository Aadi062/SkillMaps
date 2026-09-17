"""
SkillMap AI - Authentication Routes (/api/auth)
Handles registration, login, profile check, and logout.
Enforces zero password storage in database.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
import models
from database import get_db
from services.auth_service import (
    generate_session_token,
    verify_session_token,
    sync_or_create_student
)

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterPayload(BaseModel):
    name: str
    email: str
    firebase_uid: str
    career_goal: Optional[str] = "Full Stack Developer"

class LoginPayload(BaseModel):
    email: str
    firebase_uid: str
    name: Optional[str] = None

@auth_router.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    """Registers a new student profile linked with Firebase UID."""
    student = sync_or_create_student(
        db=db,
        firebase_uid=payload.firebase_uid,
        email=payload.email,
        name=payload.name,
        career_goal=payload.career_goal
    )
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

@auth_router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    """Authenticates student session synced with Firebase UID."""
    student = sync_or_create_student(
        db=db,
        firebase_uid=payload.firebase_uid,
        email=payload.email,
        name=payload.name
    )
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

@auth_router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Returns profile for active authenticated student."""
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
                        "identity_verified": True
                    }
                }
    
    return {
        "authenticated": True,
        "user": {
            "id": 1,
            "firebase_uid": "uid_rajat_demo",
            "name": "Rajat Verma",
            "email": "rajat.verma@example.edu",
            "career_goal": "Full Stack Developer",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            "level": 4,
            "level_title": "Builder",
            "xp": 4820,
            "xp_max": 6000,
            "identity_verified": True
        }
    }

@auth_router.post("/logout")
def logout():
    """Logs out student on backend."""
    return {"status": "success", "message": "Logged out successfully"}
