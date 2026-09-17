"""
Database connection and session factory for SkillMap AI.
Supports PostgreSQL (Neon Cloud) and zero-config local SQLite.
"""
import sys
import os

# Add parent backend directory to sys.path for database compatibility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from database import engine, Base, SessionLocal, get_db, init_db, is_sqlite, DATABASE_URL

__all__ = ["engine", "Base", "SessionLocal", "get_db", "init_db", "is_sqlite", "DATABASE_URL"]
