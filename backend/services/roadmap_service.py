from typing import List, Dict, Any

DEFAULT_ROADMAP = [
    {
        "id": "phase_1",
        "week_range": "Week 1-2",
        "title": "System Design Basics",
        "status": "In Progress",
        "progress": 65,
        "description": "Learn scalable API architectures, client-server models, HTTP caching, and database indexing.",
        "skills": ["System Design", "REST APIs", "Caching"],
        "milestone_project": "Design a Scalable URL Shortener API",
        "resources": [
            {"title": "Grokking the System Design Interview", "type": "Guide"},
            {"title": "ByteByteGo YouTube Architecture Breakdowns", "type": "Video"}
        ]
    },
    {
        "id": "phase_2",
        "week_range": "Week 3-4",
        "title": "Docker & Containers",
        "status": "Upcoming",
        "progress": 0,
        "description": "Containerize full-stack React and FastAPI apps using Dockerfiles, multi-stage builds, and Docker Compose.",
        "skills": ["Docker", "Containers", "DevOps"],
        "milestone_project": "Multi-container E-Commerce API with Redis & PostgreSQL",
        "resources": [
            {"title": "Docker Mastery on Udemy", "type": "Course"},
            {"title": "Official Docker Documentation", "type": "Docs"}
        ]
    },
    {
        "id": "phase_3",
        "week_range": "Week 5-6",
        "title": "AWS Cloud Practitioner",
        "status": "Upcoming",
        "progress": 0,
        "description": "Core cloud concepts: AWS EC2, S3 bucket storage, RDS PostgreSQL, IAM policies, and VPC networking.",
        "skills": ["AWS", "Cloud Storage", "S3", "EC2"],
        "milestone_project": "Deploy FastApi backend to AWS ECS/App Runner with S3 uploads",
        "resources": [
            {"title": "AWS Skill Builder Free Tier", "type": "Interactive"},
            {"title": "freeCodeCamp AWS Certified Cloud Practitioner", "type": "Video"}
        ]
    },
    {
        "id": "phase_4",
        "week_range": "Week 7-8",
        "title": "CI/CD with GitHub Actions",
        "status": "Upcoming",
        "progress": 0,
        "description": "Automate testing with Pytest/Jest, Docker image builds, and automated deployment pipelines on git push.",
        "skills": ["CI/CD", "GitHub Actions", "Automated Testing"],
        "milestone_project": "Automated Lint, Test & Vercel/Render Continuous Deployment",
        "resources": [
            {"title": "GitHub Actions Documentation", "type": "Docs"},
            {"title": "Automating Everything with CI/CD", "type": "Guide"}
        ]
    },
    {
        "id": "phase_5",
        "week_range": "Week 9-10",
        "title": "Kubernetes Basics",
        "status": "Upcoming",
        "progress": 0,
        "description": "Deploy, scale, and manage automated application containers across clusters with Pods, Services, and Ingress.",
        "skills": ["Kubernetes", "K8s", "Microservices"],
        "milestone_project": "Deploy Resilient Microservices Cluster on Minikube / K3s",
        "resources": [
            {"title": "Kubernetes Up and Running", "type": "Book"},
            {"title": "Interactive Katacoda Kubernetes Scenarios", "type": "Hands-on"}
        ]
    }
]

def get_recommended_roadmap() -> List[Dict[str, Any]]:
    return DEFAULT_ROADMAP
