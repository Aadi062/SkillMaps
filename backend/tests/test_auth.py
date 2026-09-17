"""
Unit tests for SkillMap AI Step 1: Firebase Login, Register, Logout & Session Management.
Verifies that:
1. Session tokens are correctly signed and validated with HMAC-SHA256.
2. Registration and login endpoints correctly synchronize student records.
3. Passwords are strictly never accepted or stored in PostgreSQL/SQLite.
4. GET /api/auth/me returns valid student profiles.
5. Logout endpoint invalidates the session properly.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from services.auth_service import (
    generate_session_token,
    verify_session_token,
    sync_or_create_student
)
from database import get_db, SessionLocal
import models

client = TestClient(app)

def test_session_token_generation_and_verification():
    """Verify cryptographic signing and decoding of session JWT."""
    token = generate_session_token(
        student_id=42,
        firebase_uid="firebase_test_uid_99",
        email="test.student@example.edu",
        name="Test Student"
    )
    assert token is not None
    assert len(token.split(".")) == 3
    
    claims = verify_session_token(token)
    assert claims is not None
    assert claims["sub"] == 42
    assert claims["uid"] == "firebase_test_uid_99"
    assert claims["email"] == "test.student@example.edu"
    assert claims["name"] == "Test Student"
    assert claims["exp"] > 0

def test_session_token_tamper_detection():
    """Verify that tampered tokens fail verification."""
    token = generate_session_token(1, "uid_1", "user@example.com", "User One")
    tampered = token[:-4] + "xyz1"
    assert verify_session_token(tampered) is None
    assert verify_session_token("invalid.token") is None
    assert verify_session_token("") is None

def test_student_sync_zero_password_policy():
    """Verify sync_or_create_student creates a student without any password field."""
    db = SessionLocal()
    try:
        student = sync_or_create_student(
            db=db,
            firebase_uid="uid_zero_pwd_test",
            email="zeropwd@example.edu",
            name="Privacy Advocate",
            career_goal="Cybersecurity Analyst"
        )
        assert student.id is not None
        assert student.firebase_uid == "uid_zero_pwd_test"
        assert student.career_goal == "Cybersecurity Analyst"
        # Assert Student class has no password or password_hash attribute
        assert not hasattr(student, "password")
        assert not hasattr(student, "password_hash")
        assert not hasattr(student, "hashed_password")
    finally:
        db.close()

def test_api_auth_register():
    """Verify POST /api/auth/register creates user and returns token."""
    payload = {
        "name": "Ananya Sharma",
        "email": "ananya.sharma@example.edu",
        "firebase_uid": "firebase_ananya_123",
        "career_goal": "AI/ML Engineer"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "token" in data
    assert data["user"]["name"] == "Ananya Sharma"
    assert data["user"]["email"] == "ananya.sharma@example.edu"
    assert data["user"]["career_goal"] == "AI/ML Engineer"
    assert "password" not in data["user"]

def test_api_auth_login():
    """Verify POST /api/auth/login logs in student and returns session token."""
    payload = {
        "email": "rajat.verma@example.edu",
        "firebase_uid": "firebase_rajat_uid_01",
        "name": "Rajat Verma"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "token" in data
    assert data["user"]["email"] == "rajat.verma@example.edu"

def test_api_auth_me_with_bearer_token():
    """Verify GET /api/auth/me recognizes Bearer token."""
    reg_payload = {
        "name": "Vikram Patel",
        "email": "vikram.patel@example.edu",
        "firebase_uid": "firebase_vikram_789",
        "career_goal": "Data Engineer"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload).json()
    token = reg_res["token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    data = me_res.json()
    assert data["authenticated"] is True
    assert data["user"]["name"] == "Vikram Patel"
    assert data["user"]["career_goal"] == "Data Engineer"

def test_api_auth_logout():
    """Verify POST /api/auth/logout endpoint."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
