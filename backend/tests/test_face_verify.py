import pytest
import sys
import os
import numpy as np
from PIL import Image

backend_dir = os.path.dirname(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.face_verify_service import FaceVerifyService

@pytest.fixture
def fv_service():
    return FaceVerifyService()

def test_seeded_template_status(fv_service):
    status = fv_service.get_status("student_rajat")
    assert status["is_enrolled"] is True
    assert status["student_name"] == "Rajat Verma"
    assert status["identity_verified"] is True
    assert "Identity: Verified" in status["badge"]
    assert status["privacy_specifications"]["opt_out_available"] is True
    assert len(status["privacy_specifications"]["alternative_methods"]) > 0

def test_feature_embedding_extraction(fv_service):
    # Create synthetic test image
    img = Image.new("RGB", (200, 200), color=(180, 150, 120))
    # Add synthetic facial contrast variations
    pixels = img.load()
    for i in range(50, 150):
        for j in range(50, 150):
            pixels[i, j] = (i * 2 % 255, j * 3 % 255, (i + j) % 255)
            
    vector, quality = fv_service.extract_face_embedding(img)
    assert len(vector) == 128
    assert quality["dimension"] == 128
    # Test L2 normalization
    norm = np.linalg.norm(vector)
    assert pytest.approx(norm, 0.01) == 1.0

def test_cosine_similarity_identity(fv_service):
    vec = np.random.randn(128).astype(np.float32)
    vec = vec / np.linalg.norm(vec)
    # Identical vectors should have 100% similarity and 0 distance
    sim, dist = fv_service.compute_similarity(vec, vec)
    assert sim == 100.0
    assert dist == 0.0

def test_live_verification_simulation(fv_service):
    res = fv_service.verify_live_face("student_rajat", is_simulation=True, target_context="Adaptive Skill Assessment")
    assert res["verified"] is True
    assert res["confidence_score"] >= 90.0
    assert "Verified Student Identity" in res["verification_badge"]
    assert "session_token" in res
    assert "ethical_disclaimer" in res

def test_non_biometric_otp_fallback(fv_service):
    res = fv_service.verify_non_biometric_otp("student_rajat", "123456")
    assert res["verified"] is True
    assert res["method"] == "NON_BIOMETRIC_EMAIL_OTP"
    assert "Email 2FA" in res["verification_badge"]
    assert "session_token" in res

    # Bad OTP
    bad_res = fv_service.verify_non_biometric_otp("student_rajat", "99")
    assert bad_res["verified"] is False

def test_template_purge_and_re_enrollment(fv_service):
    # Purge template
    purge_res = fv_service.delete_template("student_rajat")
    assert purge_res["success"] is True
    
    # Status should now be pending
    status = fv_service.get_status("student_rajat")
    assert status["is_enrolled"] is False
    assert status["identity_verified"] is False

    # Re-enroll with consent
    enroll_res = fv_service.enroll_template(
        student_id="student_rajat",
        student_name="Rajat Verma",
        email="rajat.verma@example.edu",
        consent_granted=True
    )
    assert enroll_res["success"] is True
    assert enroll_res["status"] == "VERIFIED"

    # Enrolling without consent must fail
    fail_res = fv_service.enroll_template(
        student_id="student_other",
        student_name="Other Student",
        email="other@example.edu",
        consent_granted=False
    )
    assert fail_res["success"] is False
