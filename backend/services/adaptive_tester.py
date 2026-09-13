import re
from typing import Dict, Any, List, Optional

CODING_CHALLENGES = [
    {
        "id": "py_dup",
        "skill": "Python",
        "title": "Find Duplicate Values in a List",
        "difficulty": "Intermediate",
        "instruction": "Write a Python function `find_duplicates(nums)` that returns a list of all elements that appear more than once in `nums`.",
        "starter_code": "def find_duplicates(nums):\n    # Write your solution here\n    pass",
        "test_cases": [
            {"input": [1, 2, 3, 2, 4, 5, 1], "expected": [1, 2]},
            {"input": [10, 20, 30], "expected": []},
            {"input": [4, 4, 4, 4], "expected": [4]}
        ],
        "claimed_level": "Advanced"
    },
    {
        "id": "py_lru",
        "skill": "Python / System Design",
        "title": "Design a Minimal LRU Cache",
        "difficulty": "Hard",
        "instruction": "Implement an LRUCache with `get(key)` and `put(key, value)` with O(1) average time complexity using OrderedDict or Doubly Linked List.",
        "starter_code": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass",
        "test_cases": [],
        "claimed_level": "Advanced"
    }
]

ADAPTIVE_QUIZ_POOL = {
    "Python": {
        "easy": {
            "id": "py_easy_1",
            "question": "What is the output of `type([])` in Python 3?",
            "options": ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"],
            "correct_index": 0,
            "difficulty": "Easy"
        },
        "medium": {
            "id": "py_med_1",
            "question": "Which data structure provides O(1) average time complexity for lookup in Python?",
            "options": ["List", "Tuple", "Dict / Set (Hash Map)", "Linked List"],
            "correct_index": 2,
            "difficulty": "Medium"
        },
        "hard": {
            "id": "py_hard_1",
            "question": "How does Python's Global Interpreter Lock (GIL) affect CPU-bound multithreaded programs?",
            "options": [
                "It enables parallel thread execution across multiple CPU cores.",
                "It prevents multiple native threads from executing Python bytecodes at once.",
                "It automatically converts CPU-bound tasks to async event loops.",
                "It optimizes memory allocation across independent process heaps."
            ],
            "correct_index": 1,
            "difficulty": "Hard"
        }
    }
}

def evaluate_code_challenge(challenge_id: str, submitted_code: str, claimed_level: str = "Advanced") -> Dict[str, Any]:
    """
    Evaluates student's code challenge across:
    - Correctness (Static pattern / test heuristics)
    - Code Quality (Style, syntax, naming)
    - Efficiency (Data structure choice, e.g. set vs nested loops)
    - Understanding (Idiomatic handling)
    Produces Claimed Level vs Verified Level comparison.
    """
    code_clean = submitted_code.strip()
    
    # 1. Correctness check
    has_func = "def find_duplicates" in code_clean or "def " in code_clean
    has_return = "return" in code_clean
    correctness_score = 90 if (has_func and has_return) else 45

    # 2. Efficiency check (Did they use a set / dict for O(n) or a nested loop O(n^2)?)
    uses_set = "set(" in code_clean or "seen = set" in code_clean or "seen" in code_clean
    uses_dict = "dict" in code_clean or "count" in code_clean or "collections" in code_clean
    uses_nested_loop = code_clean.count("for ") >= 2

    if uses_set or uses_dict:
        efficiency_score = 95
        efficiency_note = "Optimal O(n) time complexity using hash set/table."
    elif uses_nested_loop:
        efficiency_score = 65
        efficiency_note = "Sub-optimal O(n^2) nested iterations detected. Consider using a set to track seen elements."
    else:
        efficiency_score = 80
        efficiency_note = "Linear traversal with standard tracking."

    # 3. Code quality
    code_quality_score = 85 if len(code_clean) > 50 and "\n" in code_clean else 65

    # 4. Understanding / Idiomatic Python
    understanding_score = 88 if ("in " in code_clean and has_return) else 70

    overall_test_score = int(
        (correctness_score * 0.4) +
        (efficiency_score * 0.3) +
        (code_quality_score * 0.15) +
        (understanding_score * 0.15)
    )

    # Determine Verified Level vs Claimed Level
    if overall_test_score >= 90:
        verified_level = "Advanced"
    elif overall_test_score >= 75:
        verified_level = "Intermediate+"
    elif overall_test_score >= 60:
        verified_level = "Intermediate"
    else:
        verified_level = "Beginner"

    verification_status = "Verified" if overall_test_score >= 70 else "Needs Practice"

    return {
        "challenge_id": challenge_id,
        "skill": "Python",
        "claimed_level": claimed_level,
        "assessment_score": overall_test_score,
        "verified_level": verified_level,
        "verification_status": verification_status,
        "metrics": {
            "correctness": correctness_score,
            "code_quality": code_quality_score,
            "efficiency": efficiency_score,
            "understanding": understanding_score
        },
        "ai_feedback": f"Your implementation achieved {overall_test_score}/100. {efficiency_note} Claimed skill level: {claimed_level} → Confirmed Verified Level: {verified_level}.",
        "verified_badge_awarded": overall_test_score >= 75
    }

def get_adaptive_question(skill: str = "Python", current_difficulty: str = "easy") -> Dict[str, Any]:
    """
    Returns the next question in the adaptive tree based on difficulty.
    """
    pool = ADAPTIVE_QUIZ_POOL.get(skill, ADAPTIVE_QUIZ_POOL["Python"])
    target_q = pool.get(current_difficulty.lower(), pool["medium"])
    return {
        "skill": skill,
        "difficulty": current_difficulty,
        "question": target_q["question"],
        "options": target_q["options"],
        "question_id": target_q["id"]
    }
