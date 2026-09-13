"""
SkillMap Master Textbook Series Service
Provides data and chapter navigation for the complete 20-volume 10,000+ page technical textbook library.
"""

from typing import List, Dict, Any

VOLUMES_CATALOG: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Foundations, Requirements & System Architecture",
        "category": "Architecture & Engineering",
        "target_pages": 520,
        "color": "indigo",
        "summary": "Source baseline, SRS, Requirement Traceability Matrix (RTM), high-level system architecture, OWASP Top 10:2025, and NIST AI RMF 1.0.",
        "chapters": [
            "Chapter 1: The AI Career Intelligence Paradigm & Source Baseline",
            "Chapter 2: Requirements Engineering & Requirement Traceability Matrix (RTM)",
            "Chapter 3: System Architecture & Asynchronous Event-Driven Component Design",
            "Chapter 4: OWASP Top 10:2025 Security Model for EdTech Platforms",
            "Chapter 5: NIST AI Risk Management Framework (AI RMF 1.0) Integration",
            "Chapter 6: 22-Step Production Engineering Implementation Checklist",
            "Chapter 7: Academic Viva Voce Defense Guide & Examiner Inquiries"
        ],
        "key_formula": "Readiness = 0.35 * Tech + 0.25 * Projects + 0.15 * ProblemSolving + 0.10 * Comm + 0.15 * Match",
        "viva_sample": "Q: Why use spaCy + pdfplumber instead of heavy transformer models like BERT? A: Free-tier servers have 512MB RAM constraints; spaCy rule matchers run in <120MB with sub-second latency and zero memory thrashing."
    },
    {
        "id": 2,
        "title": "HTML5, CSS3, Modern JavaScript & Browser Internals",
        "category": "Frontend Core",
        "target_pages": 520,
        "color": "cyan",
        "summary": "DOM tree construction, CSSOM, Render Tree, Layout & Paint, V8 JIT compilation, Garbage Collection, and the async event loop.",
        "chapters": [
            "Chapter 1: Browser Architecture, Multiprocess Isolation & IPC",
            "Chapter 2: DOM & CSSOM Parsing Pipeline, Critical Rendering Path",
            "Chapter 3: V8 Engine Internals: Ignition Bytecode & TurboFan JIT",
            "Chapter 4: Memory Management: Scavenger vs. Mark-Sweep-Compact GC",
            "Chapter 5: Asynchronous Concurrency: Microtasks, Macrotasks & Event Loop",
            "Chapter 6: Modern Web APIs: Web Workers, IntersectionObserver & Canvas 2D"
        ],
        "key_formula": "Frame Budget = 1000ms / 60fps = 16.67ms (6ms JS execution + 10ms style/layout/composite)",
        "viva_sample": "Q: How does the event loop prioritize Promise microtasks over setTimeout? A: Microtask queue is exhausted completely after each task turn before the next macrotask is dequeued."
    },
    {
        "id": 3,
        "title": "React 18/19, Tailwind CSS & Modern Frontend Architecture",
        "category": "Frontend Core",
        "target_pages": 560,
        "color": "sky",
        "summary": "React Fiber reconciler, Concurrent Mode, WorkLoop, Suspense, Hooks lifecycle, and Tailwind utility-first CSS compilation.",
        "chapters": [
            "Chapter 1: Declarative UI & The React Fiber Reconciler",
            "Chapter 2: Fiber Node Architecture, WorkInProgress Trees & Double Buffering",
            "Chapter 3: Deep Dive into React Hooks: Dispatcher, Fiber.memoizedState LinkedList",
            "Chapter 4: State Management: Context API, Zustand & Atomic State Graphs",
            "Chapter 5: Tailwind CSS Engine: JIT Scanner, Design Tokens & Purge Optimization",
            "Chapter 6: Virtualized Lists & Rendering 10,000+ DOM Elements at 60 FPS"
        ],
        "key_formula": "Reconciliation Diff: O(n) heuristic via keys and element type comparison rather than O(n^3) tree edit distance",
        "viva_sample": "Q: Why is double buffering used in React Fiber? A: It allows rendering the work-in-progress tree in memory without mutating the active screen DOM, enabling concurrent abort/pause."
    },
    {
        "id": 4,
        "title": "Progressive Web Apps (PWA), Service Workers & Accessibility",
        "category": "Mobile & UX",
        "target_pages": 480,
        "color": "teal",
        "summary": "Service Worker lifecycle, CacheStorage strategies, Web App Manifest, Background Sync, Push Notifications, and WCAG 2.2 AAA.",
        "chapters": [
            "Chapter 1: PWA Specification & Web App Manifest Configuration",
            "Chapter 2: Service Worker Lifecycle: Register, Install, Activate, Fetch",
            "Chapter 3: Cache Storage Strategies: CacheFirst, NetworkFirst, StaleWhileRevalidate",
            "Chapter 4: Offline Data Synchronization with IndexedDB & Background Sync",
            "Chapter 5: Push Notifications & VAPID Key Cryptography",
            "Chapter 6: Accessibility (WCAG 2.2 AAA): ARIA Roles, Focus Rings & Screen Readers"
        ],
        "key_formula": "PWA Offline Availability Ratio = (Cached Requests / Total Network Requests) * 100",
        "viva_sample": "Q: What happens when a new service worker is installed while users are active? A: It enters the 'waiting' state until all browser tabs controlled by the old worker are closed, unless skipWaiting() is invoked."
    },
    {
        "id": 5,
        "title": "FastAPI, ASGI Concurrency, Pydantic v2 & OpenAPI Engineering",
        "category": "Backend Core",
        "target_pages": 560,
        "color": "emerald",
        "summary": "Uvicorn ASGI protocol, Starlette routing, uvloop asynchronous event loop, Pydantic v2 Core Rust validation, and OpenAPI 3.1.",
        "chapters": [
            "Chapter 1: ASGI Specification vs WSGI: Asynchronous Python Web Servers",
            "Chapter 2: Uvicorn, uvloop & High-Throughput Async Event Loops",
            "Chapter 3: Pydantic v2 Rust Core Validation Engine & Type Serialization",
            "Chapter 4: FastAPI Dependency Injection System & Hierarchical Scopes",
            "Chapter 5: Streaming Responses, Multipart File Uploads & Memory Safety",
            "Chapter 6: Automated OpenAPI 3.1 & Swagger Specification Generation"
        ],
        "key_formula": "Throughput = Concurrency / (I/O Wait Time + CPU Execution Time) using uvloop non-blocking sockets",
        "viva_sample": "Q: Why does FastAPI perform significantly faster than Django/Flask? A: It is built directly on Starlette and uvloop (libuv binding for Python), enabling asynchronous non-blocking event-driven I/O."
    },
    {
        "id": 6,
        "title": "PostgreSQL, Neon Cloud, Relational Modeling & Search Optimization",
        "category": "Data Engineering",
        "target_pages": 560,
        "color": "blue",
        "summary": "3NF & BCNF normalization, ACID transaction isolation levels (MVCC), B-Tree vs Hash vs GIN indexing, Full-Text Search, and CTEs.",
        "chapters": [
            "Chapter 1: Relational Algebra, Functional Dependencies & Normal Forms (3NF, BCNF)",
            "Chapter 2: Multi-Version Concurrency Control (MVCC) & Write-Ahead Logging (WAL)",
            "Chapter 3: Indexing Internals: B-Tree, Hash, GiST and Generalized Inverted (GIN)",
            "Chapter 4: PostgreSQL Full-Text Search: tsvector, tsquery & GIN Inverted Indexes",
            "Chapter 5: Complex Analytical Queries: Window Functions & Common Table Expressions (CTEs)",
            "Chapter 6: Serverless PostgreSQL: Neon Cloud Architecture & Connection Pooling"
        ],
        "key_formula": "Index Scan Cost: O(log N) for B-Tree lookup vs O(N) sequential table scan",
        "viva_sample": "Q: Why use GIN indexing instead of B-Tree for skill tags? A: GIN is an inverted index designed specifically for multivalued items (arrays, JSON, text), enabling O(1) set-intersection lookups."
    },
    {
        "id": 7,
        "title": "Authentication, Authorization, Cryptography & Web Security",
        "category": "Security",
        "target_pages": 520,
        "color": "rose",
        "summary": "JWT asymmetric signing (RS256 / Ed25519), Refresh Token rotation, OAuth2 PKCE, Firebase Auth, and Role-Based Access Control (RBAC).",
        "chapters": [
            "Chapter 1: Cryptographic Foundations: Asymmetric RSA, ECC & Hashing Algorithms",
            "Chapter 2: JSON Web Tokens (JWT): Header, Payload, Signature & Claims Validation",
            "Chapter 3: OAuth2 Authorization Code Flow with Proof Key for Code Exchange (PKCE)",
            "Chapter 4: Firebase Authentication Integration: Token Verification & Public Keys",
            "Chapter 5: Role-Based Access Control (RBAC) & Contextual Permission Middleware",
            "Chapter 6: Web Attack Vectors: CSRF, XSS, SSRF, SQL Injection & Mitigations"
        ],
        "key_formula": "JWT Signature = RSASHA256(Base64Url(header) + '.' + Base64Url(payload), private_key)",
        "viva_sample": "Q: How do you prevent XSS from stealing session tokens? A: Store tokens in HttpOnly, Secure, SameSite=Strict cookies rather than localStorage, preventing JavaScript DOM access."
    },
    {
        "id": 8,
        "title": "Resume Stream Parsing, NLP & Skill Taxonomy Extraction",
        "category": "AI & NLP",
        "target_pages": 600,
        "color": "purple",
        "summary": "pdfplumber binary stream parsing, layout-aware coordinate extraction, spaCy RuleMatcher, character span provenance, and ontology.",
        "chapters": [
            "Chapter 1: PDF Document Internals: PostScript Streams, Fonts & Bounding Boxes",
            "Chapter 2: Binary In-Memory Stream Ingestion via pdfplumber Without Disk Writes",
            "Chapter 3: Natural Language Tokenization, Lemmatization & Part-of-Speech Tagging",
            "Chapter 4: Skill Extraction: Exact Regex, Lemmatized Matching & spaCy EntityRuler",
            "Chapter 5: 1,000+ Hierarchical Skill Ontology & Canonical Aliasing",
            "Chapter 6: Provenance Span Tracking: Linking Extracted Skills to Resume Page & Line"
        ],
        "key_formula": "Precision = TP / (TP + FP); Recall = TP / (TP + FN); F1 = 2 * (P * R) / (P + R)",
        "viva_sample": "Q: How does the parser handle PDF multi-column resumes? A: pdfplumber extracts layout-aware text bounding boxes and clusters text streams by vertical coordinate before chronological reading."
    },
    {
        "id": 9,
        "title": "Job Matching, Cosine Similarity & 5-Factor Explainable AI",
        "category": "AI & Matching",
        "target_pages": 600,
        "color": "amber",
        "summary": "TF-IDF vectorization, Cosine Similarity in vector spaces, 5-Factor explainability model, missing prerequisite attribution, and APIs.",
        "chapters": [
            "Chapter 1: Vector Space Models & Term Frequency-Inverse Document Frequency (TF-IDF)",
            "Chapter 2: High-Dimensional Cosine Similarity for Document-Profile Matching",
            "Chapter 3: 5-Factor Weighted Matching Model: Skills, Projects, Edu, Exp, Interest",
            "Chapter 4: Missing Prerequisite Identification & Critical Gap Flagging",
            "Chapter 5: Real-Time Job Ingestion: Remotive API, Adzuna & Static Fallback Resilience",
            "Chapter 6: Explainable AI: Generating Student-Facing Diagnostic Justifications"
        ],
        "key_formula": "Cosine Similarity: cos(theta) = (A . B) / (||A|| * ||B||) = sum(Ai * Bi) / (sqrt(sum(Ai^2)) * sqrt(sum(Bi^2)))",
        "viva_sample": "Q: Why is TF-IDF cosine similarity used alongside categorical skill matching? A: TF-IDF captures semantic context and nuance from project descriptions that exact skill keyword matches would overlook."
    },
    {
        "id": 10,
        "title": "Skill-Gap Analysis, Readiness Scoring & 10-Week DAG Roadmaps",
        "category": "Pedagogy & Algorithms",
        "target_pages": 560,
        "color": "orange",
        "summary": "Dual-bar heatmap gap calculation, 7-factor readiness scoring, and Directed Acyclic Graph (DAG) topological sort for learning paths.",
        "chapters": [
            "Chapter 1: Competency Modeling & Industry Skill Demand Matrices",
            "Chapter 2: Mathematical Formulation of Skill Deficits: delta = max(0, R - C)",
            "Chapter 3: 7-Factor Multidimensional Career Readiness Index Calculation",
            "Chapter 4: Directed Acyclic Graph (DAG) Modeling of Learning Prerequisites",
            "Chapter 5: Kahn's Algorithm & Topological Sorting for 10-Week Roadmap Generation",
            "Chapter 6: Dynamic Milestone Injection: Capstone Projects & Verification Gates"
        ],
        "key_formula": "Skill Deficit: Delta_i = max(0, Level_required(i) - Level_current(i)); Topological Order = Kahn_Algorithm(Prerequisite_DAG)",
        "viva_sample": "Q: How do you guarantee the learning path does not suggest advanced tools before prerequisites? A: The curriculum is modeled as a Directed Acyclic Graph (DAG); topological sort guarantees prerequisites precede dependents."
    },
    {
        "id": 11,
        "title": "Adaptive Assessments, AST Code Evaluation & Proof-of-Work",
        "category": "Assessment & Testing",
        "target_pages": 520,
        "color": "yellow",
        "summary": "Item Response Theory (IRT) 3-parameter model, Python AST security sandboxing, and Claimed vs. Verified skill transitions.",
        "chapters": [
            "Chapter 1: Psychometrics & Item Response Theory (IRT) 3PL Mathematical Model",
            "Chapter 2: Adaptive Question Selection Based on Real-Time Student Ability Estimate",
            "Chapter 3: AST Code Sandboxing: Safe Execution, Static Analysis & Linting",
            "Chapter 4: 4-Axis Code Challenge Evaluation: Correctness, Efficiency, Quality, Idiom",
            "Chapter 5: Upgrading Resume Claims: Claimed vs. Verified Skill Badging",
            "Chapter 6: Tamper-Proof Skill Verification Audit Trails & Cryptographic Receipts"
        ],
        "key_formula": "IRT 3PL Probability: P(theta) = c + (1 - c) / (1 + e^(-a * (theta - b)))",
        "viva_sample": "Q: How does SkillMap safely evaluate untrusted student code? A: Using Python Abstract Syntax Trees (ast.parse) to forbid malicious module imports (__import__, os, sys, subprocess) before execution in an isolated sandbox."
    },
    {
        "id": 12,
        "title": "AI Career Coach, Speech STAR Mock Interview Simulator & Conversational AI",
        "category": "AI Agents",
        "target_pages": 560,
        "color": "pink",
        "summary": "Retrieval-Augmented Generation (RAG), Web Speech API, STAR rubric scoring (Situation, Task, Action, Result), and conversational guardrails.",
        "chapters": [
            "Chapter 1: Conversational AI Architecture for Domain-Specific Career Guidance",
            "Chapter 2: Profile-Aware Context Injection & Dynamic System Prompt Engineering",
            "Chapter 3: Speech-to-Text & Text-to-Speech Integration via Web Speech API",
            "Chapter 4: STAR Interview Rubric Evaluation: Situation, Task, Action, Result Scoring",
            "Chapter 5: Filler Word Detection, Speaking Pace & Delivery Metric Computation",
            "Chapter 6: AI Safety Guardrails: Preventing Hallucination & Off-Topic Drift"
        ],
        "key_formula": "STAR Score = 0.20 * Situation + 0.20 * Task + 0.40 * Action + 0.20 * Result - Filler_Penalty",
        "viva_sample": "Q: How does the AI coach maintain contextual memory of the student? A: The student profile state (competencies, gaps, claimed projects) is serialized into the conversational system context on every turn."
    },
    {
        "id": 13,
        "title": "Machine Learning Evaluation, Statistical Validation & Empirical QA",
        "category": "AI Research",
        "target_pages": 520,
        "color": "violet",
        "summary": "Precision, Recall, F1 across skill extraction, NDCG@K for job recommendations, ablation studies, and Wilcoxon signed-rank tests.",
        "chapters": [
            "Chapter 1: Evaluation Metrics for Information Extraction: Precision, Recall, F1",
            "Chapter 2: Ranking Quality Evaluation: Mean Reciprocal Rank (MRR) & NDCG@10",
            "Chapter 3: Ablation Study Design: Quantifying Value of 5 Matching Factors",
            "Chapter 4: Statistical Significance Testing: Wilcoxon Signed-Rank & Paired T-Tests",
            "Chapter 5: Dataset Annotation Protocol & Inter-Annotator Agreement (Cohen's Kappa)",
            "Chapter 6: Continuous Drift Detection in Job Market Skill Distributions"
        ],
        "key_formula": "NDCG@K = DCG@K / IDCG@K, where DCG@K = sum_{i=1}^K (2^{rel_i} - 1) / log_2(i + 1)",
        "viva_sample": "Q: What is NDCG and why is it superior to accuracy for job recommendations? A: Normalized Discounted Cumulative Gain penalizes highly relevant jobs appearing lower in the ranking list, reflecting real candidate job search behavior."
    },
    {
        "id": 14,
        "title": "Data Engineering, ETL Ingestion, In-Memory Caching & Telemetry",
        "category": "Data Engineering",
        "target_pages": 500,
        "color": "lime",
        "summary": "Asynchronous job ETL workers, exponential backoff, in-memory LRU caching with TTL expiration, dead-letter queues, and telemetry.",
        "chapters": [
            "Chapter 1: High-Availability External API Ingestion Pipelines",
            "Chapter 2: Resilient HTTP Clients: Exponential Backoff, Jitter & Circuit Breakers",
            "Chapter 3: In-Memory LRU Caching Strategies with Time-To-Live (TTL) Eviction",
            "Chapter 4: Dead-Letter Queues & Graceful Degradation to Curated Mock Data",
            "Chapter 5: Telemetry Schemas: Event Tracking, User Funnels & Interaction Metrics",
            "Chapter 6: Data Privacy Pipelines: Zero-Persistence of Sensitive PDF PII"
        ],
        "key_formula": "Retry Backoff Delay: T_delay = min(T_max, T_base * 2^attempt + Uniform(0, Jitter))",
        "viva_sample": "Q: What happens if Remotive API goes down during a demo? A: The job service implements a fallback circuit breaker that instantaneously serves cached datasets with 100% uptime."
    },
    {
        "id": 15,
        "title": "Software Testing, QA Engineering, Synthetic Load & Observability",
        "category": "Testing & QA",
        "target_pages": 520,
        "color": "red",
        "summary": "Test Pyramid (Unit, Integration, E2E), Pytest fixtures & Starlette TestClient, Locust synthetic load, and Sentry observability.",
        "chapters": [
            "Chapter 1: The Modern Test Pyramid: Unit, Integration, System & End-to-End Tests",
            "Chapter 2: Pytest Suite Design: Fixtures, Parameterization & Mock Injection",
            "Chapter 3: In-Memory SQLite Test Harness for Zero-Config Deterministic CI Runs",
            "Chapter 4: Synthetic User Load Testing with Locust: Measuring P95 & P99 Latency",
            "Chapter 5: Frontend Component Testing: React Testing Library & Vitest",
            "Chapter 6: Application Observability: Structured Logging, Health Probes & Sentry"
        ],
        "key_formula": "Code Coverage = (Lines Executed by Tests / Total Executable Lines) * 100 >= 85%",
        "viva_sample": "Q: How do your unit tests run without an active PostgreSQL database? A: The database layer utilizes an engine abstraction that automatically initializes an in-memory SQLite database with identical tables."
    },
    {
        "id": 16,
        "title": "DevOps, Continuous Integration (CI/CD), Docker & Cloud Quotas",
        "category": "DevOps & Cloud",
        "target_pages": 500,
        "color": "orange",
        "summary": "Multi-stage Docker builds, GitHub Actions CI workflows, zero-cost deployment (Vercel, Render, Neon, Firebase), and compute budgets.",
        "chapters": [
            "Chapter 1: Multi-Stage Dockerfile Engineering: Minimizing Production Image Footprints",
            "Chapter 2: GitHub Actions Automated CI/CD: Linting, Unit Testing & Build Validation",
            "Chapter 3: 100% Free-Tier Cloud Architecture: Vercel (Frontend) & Render (Backend)",
            "Chapter 4: Environment Variable Management, Secret Rotation & .env.example Standards",
            "Chapter 5: Cold Start Optimization & Keep-Alive Strategies on Serverless Infrastructure",
            "Chapter 6: Cloud Quota Monitoring & Zero-Cost Production Budget Discipline"
        ],
        "key_formula": "Docker Image Size Reduction = (Size_SingleStage - Size_MultiStage) / Size_SingleStage * 100 >= 75%",
        "viva_sample": "Q: How do you handle Render free-tier cold starts? A: Implemented lightweight health probes and optimized import overhead so FastAPI cold boots in under 3.5 seconds."
    },
    {
        "id": 17,
        "title": "AI Ethics, Bias Mitigation, Student Privacy & NIST AI RMF 1.0",
        "category": "Ethics & Governance",
        "target_pages": 520,
        "color": "indigo",
        "summary": "NIST AI RMF governance, demographic parity in job matching, PII redaction, DPDP Act compliance, and explainable auditing.",
        "chapters": [
            "Chapter 1: Ethical AI Principles: Fairness, Transparency, Accountability & Privacy",
            "Chapter 2: NIST AI Risk Management Framework (AI RMF 1.0) Governance Mapping",
            "Chapter 3: Algorithmic Bias Detection: Demographic Parity & Equalized Odds",
            "Chapter 4: PII Redaction Pipeline: Stripping Phone Numbers, Addresses & Names",
            "Chapter 5: Compliance with India DPDP Act 2023 & European GDPR Regulations",
            "Chapter 6: Audit Logging: Maintaining Cryptographic Trails of AI Recommendations"
        ],
        "key_formula": "Demographic Parity Difference = |P(Y=1 | Group=A) - P(Y=1 | Group=B)| <= 0.05",
        "viva_sample": "Q: How does SkillMap ensure matching algorithms do not discriminate based on gender or college tier? A: Resumes are stripped of demographic identifiers prior to vectorization; matching strictly computes competency cosine distances."
    },
    {
        "id": 18,
        "title": "UML Catalog, Data Flow Diagrams (DFD) & IEEE 830-1998 SRS",
        "category": "Documentation",
        "target_pages": 560,
        "color": "cyan",
        "summary": "Full IEEE 830-1998 SRS, DFD Level 0/1/2, complete UML diagrams (Use Case, Class, Sequence, State Machine, Activity, Deployment).",
        "chapters": [
            "Chapter 1: IEEE 830-1998 Software Requirements Specification (SRS) Standard",
            "Chapter 2: Data Flow Diagrams: Context Level 0, Detailed Level 1, Algorithmic Level 2",
            "Chapter 3: Structural UML Diagrams: Domain Class Diagrams & Object Relationships",
            "Chapter 4: Behavioral UML Diagrams: Sequence Diagrams for Resume Ingestion & Assessment",
            "Chapter 5: State Machine Diagrams: Student Profile Lifecycle (Unclaimed -> Verified)",
            "Chapter 6: Activity Diagrams: Topological Sort & Adaptive Assessment Flow",
            "Chapter 7: Physical Architecture: Deployment Diagrams & Cloud Topology"
        ],
        "key_formula": "SRS Traceability Metric: 100% of Functional Requirements map to at least one Test Case and Database Schema Entity",
        "viva_sample": "Q: Walk me through the DFD Level 1 of the Resume Parsing module. A: External Entity (User) sends PDF -> Process 1.0 (PDF Stream Extractor) -> Text Buffer -> Process 2.0 (NLP Entity Ruler) -> Entity Store (DB) -> User."
    },
    {
        "id": 19,
        "title": "Institutional College Intelligence, TPO Analytics & B2B SaaS Design",
        "category": "Institutional & Product",
        "target_pages": 500,
        "color": "emerald",
        "summary": "College placement office dashboard architecture, macro cohort skill gap clustering, placement probability, and B2B SaaS unit economics.",
        "chapters": [
            "Chapter 1: The Indian Engineering College Placement Landscape & TPO Challenges",
            "Chapter 2: Macro Cohort Analytics: Aggregating 2,500+ Student Competency Data",
            "Chapter 3: Institutional Bottleneck Identification: Finding Critical Missing Skills",
            "Chapter 4: Placement Readiness Forecasting: Predictive Cohort Segmentation",
            "Chapter 5: B2B Multi-Tenant SaaS Architecture: College Scoping & Data Isolation",
            "Chapter 6: Product Monetization, SaaS Unit Economics & Freemium Growth Engine"
        ],
        "key_formula": "Cohort Placement Rate = (Placed Students / Total Eligible Students) * 100; Institutional LTV = ARPU / Churn Rate",
        "viva_sample": "Q: How does the TPO dashboard help college administration before campus drives? A: It surfaces college-wide skill deficits (e.g. 74% students missing Docker) weeks in advance so bootcamps can be arranged."
    },
    {
        "id": 20,
        "title": "Comprehensive Viva Voce Guide, Defense Rehearsals & Complete API Reference",
        "category": "Viva Defense",
        "target_pages": 650,
        "color": "rose",
        "summary": "50 tough external examiner viva questions with rigorous defensive answers, demo troubleshooting checklist, and API reference.",
        "chapters": [
            "Chapter 1: The Psychology of University Viva Defense: What Evaluators Look For",
            "Chapter 2: 50 Hard External Examiner Questions & Rigorous Engineering Answers",
            "Chapter 3: Edge Case Rehearsals: Live Network Dropout, Corrupt PDF, Database Failover",
            "Chapter 4: Live Demonstration Script: Step-by-Step 7-Minute Perfect Defense Flow",
            "Chapter 5: Complete SkillMap REST API Reference & Parameter Specifications",
            "Chapter 6: Comprehensive Academic Bibliography, Standards & Citation Index"
        ],
        "key_formula": "Viva Success Score = Technical Clarity (40%) + Architecture Justification (30%) + Live Demo Polish (30%)",
        "viva_sample": "Q: What is the single most novel aspect of SkillMap compared to LinkedIn or Naukri? A: LinkedIn and Naukri rely on unverified self-reported keywords; SkillMap implements an adaptive code verification engine turning claims into verified proof-of-work with explainable gaps."
    }
]

def get_all_volumes() -> List[Dict[str, Any]]:
    """Returns metadata for all 20 volumes in the Master Series."""
    return VOLUMES_CATALOG

def get_volume_by_id(vol_id: int) -> Dict[str, Any]:
    """Returns detailed information for a specific volume."""
    for v in VOLUMES_CATALOG:
        if v["id"] == vol_id:
            return v
    return None

def get_textbook_statistics() -> Dict[str, Any]:
    """Calculates overall statistics across the 20-volume series."""
    total_pages = sum(v["target_pages"] for v in VOLUMES_CATALOG)
    total_chapters = sum(len(v["chapters"]) for v in VOLUMES_CATALOG)
    categories = sorted(list(set(v["category"] for v in VOLUMES_CATALOG)))
    return {
        "total_volumes": len(VOLUMES_CATALOG),
        "total_pages": total_pages,
        "total_chapters": total_chapters,
        "categories_count": len(categories),
        "categories": categories,
        "series_title": "SkillMap AI: Master Engineering Textbook Series (10,000+ Pages)",
        "accreditation": "Mapped to IEEE Software Engineering Standards & AICTE/UGC CS Curriculum"
    }
