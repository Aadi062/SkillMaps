"""
SkillMap AI - Authentication & Session Service
Enforces strict zero-password persistence in PostgreSQL/SQLite.
Firebase Auth handles credential hashing; this service verifies tokens
and maintains application student profiles.
"""

import hmac
import hashlib
import base64
import json
import time
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from models import Student

SECRET_KEY = "skillmap-ai-jwt-secret-key-production-hardening-token"

def generate_session_token(student_id: int, firebase_uid: str, email: str, name: str) -> str:
    """
    Generates a cryptographically signed HMAC-SHA256 session token.
    Contains claims: sub (student_id), uid (firebase_uid), email, name, exp.
    """
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": student_id,
        "uid": firebase_uid,
        "email": email,
        "name": name,
        "exp": int(time.time()) + (86400 * 7),  # 7 days validity
        "jti": str(uuid.uuid4())
    }
    
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifies HMAC-SHA256 signature and expiration on a session token.
    Returns decoded payload if valid, None if invalid or expired.
    """
    if not token or "." not in token:
        return None
    parts = token.split(".")
    if len(parts) != 3:
        return None
    header_b64, payload_b64, sig_b64 = parts
    
    expected_sig = hmac.new(
        SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    
    # Pad base64 if needed
    rem = len(sig_b64) % 4
    padded_sig = sig_b64 + ("=" * (4 - rem) if rem else "")
    try:
        actual_sig = base64.urlsafe_b64decode(padded_sig.encode())
    except Exception:
        return None
        
    if not hmac.compare_digest(expected_sig, actual_sig):
        return None
        
    # Decode payload
    rem_p = len(payload_b64) % 4
    padded_payload = payload_b64 + ("=" * (4 - rem_p) if rem_p else "")
    try:
        payload = json.loads(base64.urlsafe_b64decode(padded_payload.encode()).decode())
    except Exception:
        return None
        
    if payload.get("exp", 0) < time.time():
        return None
        
    return payload

def sync_or_create_student(
    db: Session,
    firebase_uid: str,
    email: str,
    name: Optional[str] = None,
    career_goal: Optional[str] = None
) -> Student:
    """
    Finds or provisions student record by firebase_uid or email.
    Explicitly NEVER touches or stores passwords.
    """
    # 1. Search by firebase_uid
    student = db.query(Student).filter(Student.firebase_uid == firebase_uid).first()
    
    # 2. If not found by firebase_uid, search by email (e.g. existing seeded user)
    if not student and email:
        student = db.query(Student).filter(Student.email == email).first()
        if student:
            # Bind existing student to this firebase_uid
            student.firebase_uid = firebase_uid
            if name:
                student.name = name
            if career_goal:
                student.career_goal = career_goal
            db.commit()
            db.refresh(student)
            return student

    # 3. If new student, provision fresh record
    if not student:
        student = Student(
            firebase_uid=firebase_uid,
            email=email,
            name=name or (email.split("@")[0].title() if email else "New Learner"),
            career_goal=career_goal or "Full Stack Developer",
            avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={firebase_uid[:8]}",
            level=1,
            level_title="Novice Explorer",
            xp=100,
            xp_max=1000,
            streak_days=1,
            career_readiness_score=45,
            avg_skill_match=50,
            projects_completed_count=0,
            assessments_taken_count=0,
            avg_assessment_score=0,
            problem_solving=60,
            programming=60,
            data_analysis=50,
            creativity=50,
            communication=50,
            leadership=40
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    else:
        # Update existing profile fields if provided
        updated = False
        if name and student.name != name:
            student.name = name
            updated = True
        if career_goal and student.career_goal != career_goal:
            student.career_goal = career_goal
            updated = True
        if updated:
            db.commit()
            db.refresh(student)

    return student
