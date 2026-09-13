const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FALLBACK_PROFILE = {
  name: "Rajat Verma",
  headline: "Full Stack & AI Engineer Aspirant",
  email: "rajat.verma@example.edu",
  avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  level: 4,
  level_title: "Builder",
  xp: 4820,
  xp_max: 6000,
  streak_days: 12,
  career_readiness_score: 82,
  avg_skill_match: 84,
  job_roles_analyzed: 12,
  projects_completed_count: 5,
  assessments_taken_count: 18,
  avg_assessment_score: 78,
  verified_skills: [
    { name: "Python", level: 92, category: "Programming", claimed_level: "Advanced", verified_level: "Intermediate+", verification_status: "Verified" },
    { name: "Data Structures", level: 88, category: "Problem Solving", claimed_level: "Advanced", verified_level: "Advanced", verification_status: "Verified" },
    { name: "React.js", level: 85, category: "Frontend", claimed_level: "Intermediate", verified_level: "Intermediate", verification_status: "Verified" },
    { name: "FastAPI", level: 84, category: "Backend", claimed_level: "Intermediate", verified_level: "Intermediate+", verification_status: "Verified" },
    { name: "SQL & PostgreSQL", level: 78, category: "Database", claimed_level: "Intermediate", verified_level: "Intermediate", verification_status: "Verified" },
    { name: "Tailwind CSS", level: 90, category: "Frontend", claimed_level: "Advanced", verified_level: "Advanced", verification_status: "Verified" },
    { name: "Git & GitHub", level: 86, category: "Tools", claimed_level: "Advanced", verified_level: "Intermediate+", verification_status: "Verified" }
  ],
  competencies: {
    problem_solving: 88,
    programming: 92,
    data_analysis: 76,
    creativity: 70,
    communication: 65,
    leadership: 60
  }
};

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend API not reachable, using offline mode", err);
  }
  return {
    status: "offline_fallback",
    platform: "SkillMap AI 1.0 (Local Preview)",
    integrations: {
      database: { engine: "SQLite / Neon PostgreSQL (Configurable)", status: "standby" },
      firebase: { auth: "ready", storage: "ready" },
      ai_nlp: { nlp_library: "spaCy + scikit-learn + pdfplumber", status: "active" },
      external_jobs_api: { remotive: "ready", static_fallback: "loaded" }
    }
  };
}

export async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback profile data", err);
  }
  return FALLBACK_PROFILE;
}

export async function fetchCareerDNA() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/career/dna`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback career DNA", err);
  }
  return {
    competencies: FALLBACK_PROFILE.competencies,
    top_matches: [
      { id: "software_engineer", title: "Software Engineer", match_score: 88, description: "Designs and builds scalable full-stack applications." },
      { id: "data_engineer", title: "Data Engineer", match_score: 81, description: "Constructs robust pipelines and analytical data lakes." },
      { id: "ai_ml_engineer", title: "AI/ML Engineer", match_score: 74, description: "Builds ML models, NLP engines, and intelligent agents." },
      { id: "cybersecurity_analyst", title: "Cybersecurity Analyst", match_score: 61, description: "Secures networks and microservice vulnerabilities." }
    ]
  };
}

export async function fetchSkillGaps() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/skills/gap`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback skill gaps", err);
  }
  return {
    gaps: [
      { skill: "System Design", current_level: 40, required_level: 80, gap: 40, priority: "High" },
      { skill: "Docker", current_level: 30, required_level: 70, gap: 40, priority: "High" },
      { skill: "AWS", current_level: 35, required_level: 75, gap: 40, priority: "Medium" },
      { skill: "CI/CD", current_level: 45, required_level: 70, gap: 25, priority: "Medium" },
      { skill: "Kubernetes", current_level: 20, required_level: 60, gap: 40, priority: "Low" }
    ]
  };
}

export async function fetchRoadmap() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/roadmap`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback roadmap", err);
  }
  return {
    roadmap: [
      { id: "w1", week_range: "Week 1-2", title: "System Design Basics", status: "In Progress", progress: 65 },
      { id: "w2", week_range: "Week 3-4", title: "Docker & Containers", status: "Upcoming", progress: 0 },
      { id: "w3", week_range: "Week 5-6", title: "AWS Cloud Practitioner", status: "Upcoming", progress: 0 },
      { id: "w4", week_range: "Week 7-8", title: "CI/CD with GitHub Actions", status: "Upcoming", progress: 0 },
      { id: "w5", week_range: "Week 9-10", title: "Kubernetes Basics", status: "Upcoming", progress: 0 }
    ]
  };
}

export async function fetchOpportunities(category = "All") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/opportunities?category=${encodeURIComponent(category)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback opportunities", err);
  }
  return {
    opportunities: [
      {
        id: "job_01",
        title: "Junior Python Developer",
        company: "ScaleTech Systems",
        location: "Remote / Bengaluru",
        type: "Jobs",
        stipend: "₹6,00,000 - ₹8,50,000 / yr",
        match_score: 87,
        tags: ["Python", "FastAPI", "Docker", "Remote"]
      },
      {
        id: "job_02",
        title: "Data Analyst Intern",
        company: "Deloitte",
        location: "Bangalore, India",
        type: "Internships",
        stipend: "₹35,000 / month",
        match_score: 82,
        tags: ["Python", "SQL", "Pandas", "Analytics"]
      },
      {
        id: "job_03",
        title: "ML Engineering Intern",
        company: "Microsoft",
        location: "Hyderabad, India",
        type: "Internships",
        stipend: "₹60,000 / month",
        match_score: 79,
        tags: ["Python", "scikit-learn", "NLP", "PyTorch"]
      },
      {
        id: "hack_01",
        title: "Smart India Hackathon 2026",
        company: "Ministry of Education & AICTE",
        location: "Pan-India / Virtual",
        type: "Hackathons",
        stipend: "₹1,00,000 Prize Pool",
        match_score: 95,
        tags: ["AI", "Full Stack", "Problem Solving"]
      },
      {
        id: "res_01",
        title: "NLP & LLM Safety Research Fellow",
        company: "IISc Computational Labs",
        location: "Bengaluru, India",
        type: "Research",
        stipend: "₹45,000 / month Fellowship",
        match_score: 81,
        tags: ["NLP", "Transformers", "spaCy", "Python"]
      },
      {
        id: "os_01",
        title: "FastAPI Core Ecosystem Contributor",
        company: "Tiangolo Open Source",
        location: "Global / GitHub",
        type: "Open Source",
        stipend: "Bounty & Recognition Badges",
        match_score: 89,
        tags: ["Python", "Pydantic", "FastAPI", "Docs"]
      }
    ]
  };
}

export async function sendCoachMessage(message) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coach/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback coach response", err);
  }
  return {
    reply: "Based on your profile, focus on these skills to maximize your internship chances:\n\n• Data Structures & Algorithms\n• SQL & Database\n• System Design Basics\n• Build 2 Projects\n\n*(Reasoning based on 1,245 job postings and your current skill level).* ",
    suggested_actions: ["What should I learn this week?", "Why am I not matching backend jobs?", "Review my project"]
  };
}

export async function evaluateInterview(role, questionId, answerText) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, question_id: questionId, answer_text: answerText })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback interview eval", err);
  }
  return {
    role,
    overall_score: 76,
    metrics: {
      technical: 82,
      communication: 71,
      confidence: 68,
      completeness: 78
    },
    feedback: "Solid technical explanation with good terminology coverage. Work on structuring your response using the STAR method."
  };
}

export async function parseResume(fileOrText, isFile = false) {
  try {
    const formData = new FormData();
    if (isFile) {
      formData.append("file", fileOrText);
    } else {
      formData.append("resume_text", fileOrText);
    }
    const res = await fetch(`${API_BASE_URL}/api/resume/parse`, {
      method: "POST",
      body: formData
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Resume parsing error", err);
  }
  return {
    message: "Demo resume parsed (Local fallback)",
    extracted_contact: { email: "rajat.verma@example.edu" },
    skills_detected_count: 8,
    extracted_skills: {
      programming: ["Python", "JavaScript", "SQL"],
      frontend: ["React.js", "Tailwind CSS"],
      backend: ["FastAPI"],
      cloud_devops: ["Docker", "Git"]
    },
    new_career_readiness: 85
  };
}

// ----------------- ADVANCED SERVICES -----------------

export async function fetchAdaptiveQuestion(skill = "Python", difficulty = "medium") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/skills/adaptive/question?skill=${encodeURIComponent(skill)}&difficulty=${encodeURIComponent(difficulty)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback adaptive question", err);
  }
  return {
    skill,
    difficulty,
    question: "Which data structure provides O(1) average time complexity for lookup in Python?",
    options: ["List", "Tuple", "Dict / Set (Hash Map)", "Linked List"],
    question_id: "py_med_1"
  };
}

export async function fetchCodingChallenges() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/skills/challenges`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback challenges", err);
  }
  return {
    challenges: [
      {
        id: "py_dup",
        skill: "Python",
        title: "Find Duplicate Values in a List",
        difficulty: "Intermediate",
        instruction: "Write a Python function find_duplicates(nums) that returns a list of all elements that appear more than once in nums.",
        starter_code: "def find_duplicates(nums):\n    seen = set()\n    duplicates = set()\n    for n in nums:\n        if n in seen:\n            duplicates.add(n)\n        else:\n            seen.add(n)\n    return list(duplicates)",
        claimed_level: "Advanced"
      }
    ]
  };
}

export async function verifyCodeChallenge(challengeId, code, claimedLevel = "Advanced") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/skills/verify/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_id: challengeId, code, claimed_level: claimedLevel })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback code verify", err);
  }
  return {
    challenge_id: challengeId,
    skill: "Python",
    claimed_level: claimedLevel,
    assessment_score: 86,
    verified_level: "Intermediate+",
    verification_status: "Verified",
    metrics: { correctness: 90, code_quality: 85, efficiency: 95, understanding: 88 },
    ai_feedback: "Optimal O(n) hash set solution. Claimed: Advanced → Confirmed Verified: Intermediate+.",
    verified_badge_awarded: true
  };
}

export async function fetchProjectQuests() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects/quests`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback quests", err);
  }
  return {
    quests: [
      {
        id: "quest_01",
        title: "Build an AI To-Do Application",
        difficulty: "Intermediate",
        category: "Full Stack & AI",
        description: "Don't just learn React—prove it by building an AI-assisted task manager with smart priority suggestions, RESTful API endpoints, and database persistence.",
        required_skills: ["React", "JavaScript", "REST API", "Git", "Database"],
        rewards: {
          skills: [
            { skill: "React", boost: 10 },
            { skill: "REST API", boost: 8 },
            { skill: "Git", boost: 5 }
          ],
          portfolio_strength: 12,
          xp: 350,
          badge: "React Builder Quest"
        },
        status: "Available"
      },
      {
        id: "quest_02",
        title: "Distributed URL Shortener with Caching",
        difficulty: "Advanced",
        category: "System Design",
        description: "Prove your System Design and Docker skills. Architect a high-throughput URL shortener with Redis caching, PostgreSQL sharding, and rate limiting.",
        required_skills: ["System Design", "Docker", "Redis", "PostgreSQL", "Python"],
        rewards: {
          skills: [
            { skill: "System Design", boost: 15 },
            { skill: "Docker", boost: 12 },
            { skill: "Redis", boost: 10 }
          ],
          portfolio_strength: 18,
          xp: 500,
          badge: "System Architect"
        },
        status: "In Progress"
      }
    ]
  };
}

export async function claimProjectQuest(questId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects/quests/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quest_id: questId })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback quest claim", err);
  }
  return {
    message: "Quest claimed successfully!",
    xp_earned: 350,
    new_total_xp: 5170,
    skill_boosts: [
      { skill: "React", boost: 10 },
      { skill: "REST API", boost: 8 },
      { skill: "Git", boost: 5 }
    ],
    portfolio_strength_boost: 12,
    new_career_readiness: 85
  };
}

export async function fetchLivingPortfolio() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/portfolio/living`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback living portfolio", err);
  }
  return {
    student: FALLBACK_PROFILE,
    multidimensional_readiness: {
      technical_skills: 88,
      projects: 79,
      problem_solving: 85,
      communication: 67,
      portfolio: 80,
      interview: 72,
      job_match: 91,
      overall: 82,
      ai_diagnosis: "Your biggest weakness is communication (67%). Improve this with AI Mock Interviews before applying."
    },
    verified_skills: FALLBACK_PROFILE.verified_skills,
    projects: [
      { id: "p1", title: "AI Chatbot", progress: 100, status: "Completed", tech_stack: ["FastAPI", "React", "LangChain"] },
      { id: "p2", title: "E-Commerce API", progress: 60, status: "In Progress", tech_stack: ["FastAPI", "PostgreSQL", "Redis"] }
    ],
    badges: [
      { id: "b1", name: "Top Scorer", icon: "trophy" },
      { id: "b2", name: "React Builder Quest", icon: "code" }
    ],
    shareable_url: "https://skillmap.ai/portfolio/rajat-verma"
  };
}

export async function fetchTPOAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tpo/analytics`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback TPO analytics", err);
  }
  return {
    institution_name: "National Institute of Technology & Engineering",
    academic_year: "2025-2026",
    total_students_tracked: 2500,
    cohort_readiness_distribution: {
      career_ready_pct: 42,
      nearly_ready_pct: 31,
      skill_gap_pct: 20,
      high_risk_pct: 7
    },
    top_missing_skills: [
      { skill: "Cloud & AWS", missing_pct: 72, affected_students: 1800 },
      { skill: "Data Structures & Algorithms", missing_pct: 61, affected_students: 1525 },
      { skill: "AI / Machine Learning", missing_pct: 58, affected_students: 1450 },
      { skill: "Professional Communication", missing_pct: 51, affected_students: 1275 },
      { skill: "Cybersecurity Fundamentals", missing_pct: 39, affected_students: 975 }
    ]
  };
}

export async function fetchKnowledgeGraph() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/knowledge-graph`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback knowledge graph", err);
  }
  return {
    nodes: [
      { id: "python", label: "Python", group: "skill", level: 92 },
      { id: "react", label: "React.js", group: "skill", level: 85 },
      { id: "role_swe", label: "Software Engineer", group: "career", match: "88%" }
    ],
    links: [
      { source: "python", target: "role_swe", relationship: "core_requirement" },
      { source: "react", target: "role_swe", relationship: "frontend_stack" }
    ]
  };
}

export async function fetchExplainableMatch(jobTitle = "Junior Python Developer") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/opportunities/explainable?job_title=${encodeURIComponent(jobTitle)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback explainable match", err);
  }
  return {
    job_title: jobTitle,
    overall_match: 87,
    factors: { skills: 92, projects: 84, education: 90, experience: 65, career_interest: 95 },
    missing_skills: ["Docker", "AWS Cloud"],
    why_recommended: [
      "Strong programming fundamentals (92% DNA)",
      "Demonstrated full-stack project experience (AI Chatbot)",
      "High skill overlap in Python, React, and REST APIs"
    ]
  };
}

export async function fetchTextbookVolumes() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/textbook/volumes`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback textbook volumes", err);
  }
  return {
    statistics: {
      total_volumes: 20,
      total_pages: 10720,
      total_chapters: 124,
      categories_count: 10,
      categories: ["Architecture", "Frontend Core", "Backend Core", "Mobile & UX", "Data Engineering", "Security", "AI & NLP", "AI & Matching", "Testing & QA", "DevOps & Cloud", "Ethics & Governance", "Viva Defense"]
    },
    volumes: [
      {
        id: 1,
        title: "Foundations, Requirements & System Architecture",
        category: "Architecture",
        target_pages: 520,
        summary: "Source baseline, SRS, Requirement Traceability Matrix (RTM), high-level system architecture, OWASP Top 10:2025, and NIST AI RMF 1.0.",
        chapters: [
          "Chapter 1: The AI Career Intelligence Paradigm & Source Baseline",
          "Chapter 2: Requirements Engineering & Requirement Traceability Matrix (RTM)",
          "Chapter 3: System Architecture & Asynchronous Event-Driven Component Design",
          "Chapter 4: OWASP Top 10:2025 Security Model for EdTech Platforms",
          "Chapter 5: NIST AI Risk Management Framework (AI RMF 1.0) Integration",
          "Chapter 6: 22-Step Production Engineering Implementation Checklist",
          "Chapter 7: Academic Viva Voce Defense Guide & Examiner Inquiries"
        ],
        key_formula: "Readiness = 0.35 * Tech + 0.25 * Projects + 0.15 * ProblemSolving + 0.10 * Comm + 0.15 * Match",
        viva_sample: "Q: Why use spaCy + pdfplumber instead of heavy transformer models like BERT? A: Free-tier servers have 512MB RAM constraints; spaCy rule matchers run in <120MB with sub-second latency and zero memory thrashing."
      }
    ]
  };
}

