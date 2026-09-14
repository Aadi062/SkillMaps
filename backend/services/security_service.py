"""
SkillMap Shield Security Service Module
Re-exports the core security shield manager and singleton.
"""
from services.shield_service import SecurityShieldManager, security_shield, SQLI_PATTERNS, XSS_PATTERNS, PATH_TRAVERSAL_PATTERNS, AI_PROMPT_INJECTION_PATTERNS

__all__ = [
    "SecurityShieldManager",
    "security_shield",
    "SQLI_PATTERNS",
    "XSS_PATTERNS",
    "PATH_TRAVERSAL_PATTERNS",
    "AI_PROMPT_INJECTION_PATTERNS"
]
