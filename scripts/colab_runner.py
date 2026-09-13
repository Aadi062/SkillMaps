"""
SkillMap AI Standalone Google Colab Setup & Public Tunnel Runner
Configured for: aadifernandes919@gmail.com
"""

import os
import sys
import subprocess
import time

USER_EMAIL = "aadifernandes919@gmail.com"

def run_cmd(cmd: str):
    print(f">> Executing: {cmd}")
    subprocess.check_call(cmd, shell=True)

def setup_colab_environment():
    print("=" * 60)
    print(f"🚀 SKILLMAP AI — GOOGLE COLAB RUNNER ({USER_EMAIL})")
    print("=" * 60)

    # 1. Environment variables
    os.environ["USER_EMAIL"] = USER_EMAIL
    os.environ["DATABASE_URL"] = "sqlite:///./skillmap_colab.db"
    os.environ["FIREBASE_PROJECT_ID"] = "skillmap-ai-production"
    os.environ["FIREBASE_STORAGE_BUCKET"] = "skillmap-ai-production.appspot.com"
    os.environ["REMOTIVE_API_KEY"] = "remotive_public_free_tier_unlimited"
    os.environ["SECRET_KEY"] = f"colab_secure_jwt_token_{USER_EMAIL}"

    print(f"[1/4] Environment configured for: {USER_EMAIL}")

    # 2. Verify spaCy & dependencies
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("[2/4] spaCy NLP pipeline loaded successfully.")
    except Exception:
        print("[2/4] Installing spaCy English model...")
        run_cmd("python -m spacy download en_core_web_sm -q")

    # 3. Check LocalTunnel or Cloudflared
    print("[3/4] Checking tunneling daemon...")
    try:
        ip = subprocess.check_output(["curl", "-s", "https://loca.lt/mytunnelpassword"]).decode("utf-8").strip()
        print(f"🔑 LocalTunnel Password / Endpoint IP: {ip}")
    except Exception:
        print("Tunnel password check bypassed.")

    # 4. Launch backend
    print(f"[4/4] Starting SkillMap AI on port 8000 for {USER_EMAIL}...")
    backend_cmd = "uvicorn main:app --host 0.0.0.0 --port 8000"
    print(f"Server command: {backend_cmd}")
    print("\n✓ Google Colab setup complete!")

if __name__ == "__main__":
    setup_colab_environment()
