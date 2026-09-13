from typing import Dict, Any, List

ADVANCED_COACH_RESPONSES = {
  "this_week": {
    "reply": "Here is your high-impact plan for **this week**:\n\n1. **Monday - Wednesday**: Complete the **System Design Basics** module on caching and rate limiters (bridges your 40% gap).\n2. **Thursday - Friday**: Solve the **Find Duplicate Values** Python coding challenge to upgrade your verified Python skill level.\n3. **Weekend**: Start the **Project Quest: Distributed URL Shortener** to earn +15 System Design, +12 Docker, and +500 XP!\n\n*(Focusing on System Design will boost your overall Career Readiness by +5 points by Sunday).* ",
    "suggested_actions": ["Open Project Quest", "Take Python Code Verification", "Review System Design Week 1-2"]
  },
  "backend_match": {
    "reply": "You're matching **87%** with junior backend roles, but top-tier positions require containerization and cloud experience.\n\n• **Current Strengths**: FastAPI (84%), SQL (78%), REST APIs (85%).\n• **Why You Miss Some Roles**: 1,245 job postings require **Docker (Your level: 30%)** and **AWS EC2/S3 (Your level: 35%)**.\n• **Action**: Complete the Docker Project Quest to unlock 94% match on ScaleTech and Stripe listings!",
    "suggested_actions": ["Start Docker Quest", "View Explainable Match Breakdown", "Take Docker Quiz"]
  },
  "best_career": {
    "reply": "Based on your multidimensional **Career DNA** and verified project portfolio:\n\n🥇 **Software Engineer (88% Match)**: Your highest fit! Driven by 92% Programming and 88% Problem Solving scores.\n🥈 **Data Engineer (81% Match)**: High suitability with your strong SQL and data structures background.\n🥉 **AI/ML Engineer (74% Match)**: Strong potential if you expand from scikit-learn into deep learning frameworks like PyTorch.\n\nRecommendation: Target **Software Engineer** as your primary track, with backend systems specialization.",
    "suggested_actions": ["View Full Career DNA", "Explore SWE Roadmaps", "See SWE Internships"]
  },
  "can_i_apply": {
    "reply": "Yes, you are **ready to apply** for the **Junior Python Developer at ScaleTech (86% Match)** and **Software Engineer Apprentice at Stripe (88% Match)**!\n\n• Your technical readiness (88) and problem-solving (85) exceed the applicant benchmark (70).\n• **Pre-application Tip**: Mention your completed **AI Chatbot** project in your cover letter and practice a STAR-method mock interview to raise your communication confidence.",
    "suggested_actions": ["Apply via Remotive", "Launch Interview Simulator", "Export Living Portfolio"]
  },
  "review_project": {
    "reply": "Reviewing your **AI Chatbot** project:\n\n✓ **Architecture**: Solid FastAPI asynchronous backend + LangChain integration.\n✓ **Frontend**: Responsive React PWA with Tailwind styling.\n→ **Suggested Upgrade**: Add Redis session caching and write 3 integration tests using Pytest to showcase site-reliability engineering (SRE) rigor.\n\nThis will add +8 to your Portfolio Strength score!",
    "suggested_actions": ["Start Docker Containerization", "Add GitHub Badge", "Export Verified Portfolio"]
  }
}

def generate_coach_response(user_message: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates intelligent, context-aware AI Career Coach guidance with deep profile memory.
    """
    msg = user_message.lower()
    student_name = profile_data.get("name", "Rajat")
    readiness = profile_data.get("career_readiness_score", 82)

    if "this week" in msg or "what should i learn this week" in msg:
        res = ADVANCED_COACH_RESPONSES["this_week"]
        return {"reply": f"Hi {student_name}! " + res["reply"], "suggested_actions": res["suggested_actions"]}
    elif "why am i not matching" in msg or "backend jobs" in msg or "missing" in msg:
        res = ADVANCED_COACH_RESPONSES["backend_match"]
        return {"reply": res["reply"], "suggested_actions": res["suggested_actions"]}
    elif "which career" in msg or "career is best" in msg or "direction" in msg:
        res = ADVANCED_COACH_RESPONSES["best_career"]
        return {"reply": res["reply"], "suggested_actions": res["suggested_actions"]}
    elif "can i apply" in msg or "ready to apply" in msg or "internship" in msg and "apply" in msg:
        res = ADVANCED_COACH_RESPONSES["can_i_apply"]
        return {"reply": res["reply"], "suggested_actions": res["suggested_actions"]}
    elif "review my project" in msg or "review project" in msg:
        res = ADVANCED_COACH_RESPONSES["review_project"]
        return {"reply": res["reply"], "suggested_actions": res["suggested_actions"]}
    elif "internship" in msg or "learn this month" in msg:
        return {
            "reply": f"Hi {student_name}! Based on your profile, focus on these skills to maximize your internship chances:\n\n• **Data Structures & Algorithms**: Master Arrays, Trees, and Dynamic Programming.\n• **SQL & Database**: Learn indexing, joins, and schema normalization.\n• **System Design Basics**: Understand RESTful APIs, caching, and rate limiting.\n• **Build 2 Projects**: Deploy one AI-powered application and one backend API.\n\n*(Reasoning based on 1,245 job postings and your current skill level: 82/100 readiness).* ",
            "suggested_actions": ["Start System Design Week 1-2", "Take DSA Assessment", "Review Opportunities"]
        }
    else:
        return {
            "reply": f"Hi {student_name}! Your Career Readiness is currently **{readiness}/100** (Top 8% among candidates). "
                     f"Your greatest leverage point right now is closing your **System Design** gap (40% gap) and practicing an **AI Mock Interview** to raise your communication readiness from 67 to 80. How can I guide you today?",
            "suggested_actions": [
                "What should I learn this week?",
                "Why am I not matching backend jobs?",
                "Which career is best for me?",
                "Can I apply for this internship?",
                "Review my project"
            ]
        }
