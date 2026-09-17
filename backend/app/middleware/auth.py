"""
SkillMap AI - Authentication & Token Verification Middleware
Protects sensitive student endpoints via Bearer token verification.
"""
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from services.auth_service import verify_session_token

security = HTTPBearer(auto_error=False)

def get_current_user_claims(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[Dict[str, Any]]:
    """Extracts and verifies JWT session claims from Bearer header."""
    if not credentials:
        return None
    return verify_session_token(credentials.credentials)

def require_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Dict[str, Any]:
    """Enforces authentication; raises 401 if missing or invalid."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication token required.")
    claims = verify_session_token(credentials.credentials)
    if not claims:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")
    return claims
