"""
SkillMap AI - Modular Application Entry Point
"""
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app as core_app
from app.routes.auth import auth_router
from app.routes.users import users_router

app = core_app
app.include_router(auth_router)
app.include_router(users_router)
