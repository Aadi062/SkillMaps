"""
Unit tests for SkillMap AI Phase 2: Student Profile Foundation.
Verifies academic fields, career preferences, bio updates, and zero-password policy.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from services.auth_service import generate_session_token
from database import SessionLocal
import models

client = TestClient(app)

def test_get_student_profile():
    """Verify GET /api/users/profile returns academic and profile attributes."""
    response = client.get("/api/users/profile")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "career_goal" in data
    assert "college" in data
    assert "degree" in data
    assert "cgpa" in data
    assert "competencies" in data
    assert "password" not in data

def test_update_student_profile_authenticated():
    """Verify PUT /api/users/profile updates student fields."""
    token = generate_session_token(1, "uid_rajat_demo", "rajat.verma@example.edu", "Rajat Verma")
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "headline": "Lead AI Researcher & Full Stack Architect",
        "bio": "Building next-generation embodied AI career coaches.",
        "college": "Stanford / IIT Bombay",
        "degree": "M.S. in Artificial Intelligence",
        "graduation_year": 2026,
        "cgpa": 9.5,
        "location": "San Francisco / Bengaluru",
        "target_role": "AI Research Engineer",
        "github_url": "https://github.com/Aadi062/SkillMaps",
        "linkedin_url": "https://linkedin.com/in/rajat-verma-ai"
    }
    
    response = client.put("/api/users/profile", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    user = data["user"]
    assert user["headline"] == "Lead AI Researcher & Full Stack Architect"
    assert user["college"] == "Stanford / IIT Bombay"
    assert user["cgpa"] == 9.5
    assert user["target_role"] == "AI Research Engineer"
    assert "password" not in user

def test_profile_zero_password_invariant():
    """Verify that password fields are never persisted or exposed on Student model."""
    db = SessionLocal()
    try:
        student = db.query(models.Student).first()
        if student:
            assert not hasattr(student, "password")
            assert not hasattr(student, "password_hash")
    finally:
        db.close()
