from typing import Dict, Any, List

SAMPLE_QUESTIONS = [
    {
        "id": "q1",
        "role": "Python Developer",
        "question": "How does Python handle memory management and garbage collection internally?",
        "expected_keywords": ["reference counting", "garbage collector", "generational", "cyclic", "memory leaks", "gil"],
        "difficulty": "Intermediate"
    },
    {
        "id": "q2",
        "role": "Python Developer",
        "question": "Explain the difference between FastAPI and Flask/Django, and why asynchronous handling matters.",
        "expected_keywords": ["async", "await", "asgi", "pydantic", "speed", "concurrency", "uvicorn"],
        "difficulty": "Intermediate"
    },
    {
        "id": "q3",
        "role": "Full Stack Engineer",
        "question": "How do you optimize a slow React application encountering re-rendering bottlenecks?",
        "expected_keywords": ["usememo", "usecallback", "react.memo", "virtualization", "profiler", "state placement"],
        "difficulty": "Advanced"
    }
]

def evaluate_interview_response(role: str, question_id: str, answer_text: str) -> Dict[str, Any]:
    """
    Evaluates student answer against rubric: Technical, Communication, Confidence, Completeness.
    """
    clean_ans = answer_text.strip().lower()
    word_count = len(clean_ans.split())

    # Find question keywords
    target_q = next((q for q in SAMPLE_QUESTIONS if q["id"] == question_id), SAMPLE_QUESTIONS[0])
    keywords = target_q.get("expected_keywords", ["python", "fastapi", "performance"])

    matched_kw = sum(1 for kw in keywords if kw in clean_ans)
    kw_ratio = matched_kw / max(1, len(keywords))

    # Rubric metrics:
    technical_score = int(min(95, max(60, 65 + (kw_ratio * 30))))
    completeness_score = int(min(94, max(55, 60 + (min(word_count, 120) / 120.0 * 32))))
    communication_score = int(min(90, max(60, 68 + (5 if word_count > 30 else -5))))
    confidence_score = int(min(88, max(58, 65 + (5 if matched_kw >= 2 else 0))))

    overall_score = int(
        (technical_score * 0.4) +
        (communication_score * 0.25) +
        (completeness_score * 0.25) +
        (confidence_score * 0.1)
    )

    feedback = []
    if kw_ratio >= 0.5:
        feedback.append("Excellent technical keyword coverage and domain terminology.")
    else:
        feedback.append(f"Consider explicitly discussing key concepts like: {', '.join(keywords[:3])}.")

    if word_count < 25:
        feedback.append("Your response was concise; elaborate with real-world project examples.")
    else:
        feedback.append("Great structured explanation using concrete technical arguments.")

    return {
        "role": role,
        "question": target_q["question"],
        "overall_score": overall_score,
        "metrics": {
            "technical": technical_score,
            "communication": communication_score,
            "confidence": confidence_score,
            "completeness": completeness_score
        },
        "feedback": " ".join(feedback),
        "key_takeaways": [
            "Use STAR method for open-ended technical questions.",
            "Cite trade-offs (e.g. memory vs CPU latency).",
            "Relate answers to your GitHub projects."
        ]
    }
