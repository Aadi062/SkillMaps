# SkillMap AI — Personal Career Intelligence & Readiness Platform

> **"Discover your career. Prove your skills. Build your future."**  
> An AI platform that understands you, verifies your skills, closes your skill gaps, and connects you to high-match opportunities.

---

## 🌟 Overview & Features

SkillMap AI guides students through **The Complete Student Journey**:
1. **Discover Yourself**: AI analyzes your resume, academics, projects, and skills.
2. **Assess & Verify Skills**: Adaptive AI tests evaluate your verified skill level.
3. **Find Your Best Careers**: Predicts best career paths with match scores (SWE 88%, Data Eng 81%, AI/ML 74%, Cyber 61%).
4. **Close Skill Gaps**: Personalized 10-week roadmap with hands-on projects and resources.
5. **Build & Prove Yourself**: Build projects, earn verified badges, and publish your portfolio.
6. **Get Opportunities**: Matched jobs, internships, and hackathons via Remotive & Adzuna APIs.

### Core Modules
- **Smart Dashboard**: Real-time Career Readiness gauge (82/100), average skill match (84%), projects completed (5), and assessments taken (18).
- **AI Career DNA Radar**: 6-axis competency model (Problem Solving 88%, Programming 92%, Data Analysis 76%, Creativity 70%, Communication 65%, Leadership 60%).
- **Skill Gap Matrix**: Dual-bar comparison vs. industry benchmarks (System Design, Docker, AWS, CI/CD, Kubernetes).
- **AI Career Coach Chatbot**: Context-aware guidance trained on 1,245 live job postings.
- **Resume Intelligence Parser**: PDF and text extraction powered by `pdfplumber` and `spaCy` NLP taxonomy.
- **Mock Interview Simulator**: AI rubric scoring across Technical, Communication, Confidence, and Completeness.
- **Opportunity Engine**: Live job & internship aggregator with match scores.
- **Mobile PWA Simulator**: Interactive phone preview featuring all 6 Figma mobile screens.
- **Gamification HUD**: Level 4 Builder, XP progress (4,820 / 6,000), 12-day streak, and unlockable badges.

---

## 🏗️ System Architecture & Tech Stack (100% Free Tier)

```
[ Frontend (React PWA + Tailwind CSS) ]
                   │
                   ▼ (HTTP / JSON)
[ API Gateway (FastAPI on Vercel / Render) ]
       │                         │
       ▼                         ▼
[ AI / NLP Services ]     [ Database & Storage ]
• spaCy + pdfplumber      • Neon.tech PostgreSQL (Cloud)
• scikit-learn Matching   • SQLite (Local Zero-Config Fallback)
• Career Intelligence     • Firebase Auth & Storage
       │
       ▼
[ External Job Feeds ]
• Remotive API & Adzuna API
• Static Fallback Database
```

| Layer | Technology | Free-Tier Hosting / Engine |
|---|---|---|
| **Frontend / Mobile** | React 18, Tailwind CSS, PWA, Recharts, Lucide | Vercel Static Hosting |
| **Backend API** | Python 3.14, FastAPI, Uvicorn | Render Web Service / Vercel Serverless |
| **AI / Machine Learning** | spaCy, pdfplumber, scikit-learn, Skill Taxonomy | In-Memory / Stateless AI Microservice |
| **Database** | PostgreSQL | Neon.tech Serverless Cloud PostgreSQL |
| **Auth & File Storage** | Firebase Auth & Firebase Storage | Firebase Spark Free Tier |
| **Job Opportunities** | Remotive API, Adzuna API | Public Free Developer APIs |
| **DevOps & CI/CD** | Pytest, GitHub Actions | GitHub Actions Free Runner |

---

## 📁 Project Structure

```
skillmap/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── firebase.js
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── users.py
│   │   ├── middleware/
│   │   │   └── auth.py
│   │   └── database/
│   │       └── database.py
│   ├── services/
│   ├── tests/
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 12-Phase Development Order

1. **PHASE 1: 🔐 Login / Register / Logout** *(Completed)*
   - Firebase Authentication + Zero-Password PostgreSQL/SQLite User Store.
   - Professional Login screen with Password Eye toggle, Google OAuth, and 1-Click Demo Logins.
   - Registration screen with Full Name, Email, Password verification, and Career Goal selection.
   - Top-right Profile Dropdown (`👤 [User Name] ▼`) with quick access to Profile, Settings, Security, and Logout.
2. **PHASE 2: 👤 Student Profile & Learning DNA**
3. **PHASE 3: 📄 Resume Upload & Parsing Engine**
4. **PHASE 4: 🧠 AI Resume & Skill Extraction**
5. **PHASE 5: 🧪 Skill Assessment & Verification**
6. **PHASE 6: 💼 Job Matching & Opportunity Engine**
7. **PHASE 7: 📊 Skill Gap + Career Readiness**
8. **PHASE 8: 🤖 AI Career Coach**
9. **PHASE 9: 🎤 AI Interview Simulator**
10. **PHASE 10: 📷 Facial Identity Verification (FaceVerify)**
11. **PHASE 11: 🛡️ SkillMap Shield / Cybersecurity Gateway**
12. **PHASE 12: 🏆 Portfolio + College TPO Dashboard**


---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm

### Method 1: One-Click Startup (PowerShell on Windows)
```powershell
.\start.ps1
```
This simultaneously boots the FastAPI backend on `http://localhost:8000` and the React frontend on `http://localhost:5173`.

---

### Method 2: Manual Step-by-Step

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt httpx python-multipart pytest
python -m uvicorn main:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Testing

### Backend Unit Tests (Pytest)
```bash
cd backend
python -m pytest tests/test_api.py -v
```
Verifies:
- Health check and cloud integration status
- Profile and gamification data
- Career DNA competency calculations and top matches
- Skill gap analysis vs. industry benchmarks
- AI Career Coach context responses
- Interview simulator 4-metric scoring rubric
- Opportunity matching engine
- NLP Resume parser and skill extraction

### Frontend Build Verification
```bash
cd frontend
npm run build
```

---

## 🌐 Deployment Configuration

- **Vercel**: Configured in `vercel.json` for full-stack serverless deployment.
- **Render**: Configured in `render.yaml` for FastAPI web service deployment.
- **CI/CD**: Configured in `.github/workflows/ci.yml` running automated tests on every push and PR.
- **Database**: To connect Neon.tech PostgreSQL, set `DATABASE_URL` in `.env`.
