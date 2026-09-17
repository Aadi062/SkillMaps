from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, default="Rajat Verma")
    email = Column(String, unique=True, index=True, default="rajat@skillmap.ai")
    career_goal = Column(String, default="Full Stack Developer")
    headline = Column(String, default="Full Stack & AI Engineer Aspirant")
    bio = Column(Text, default="Passionate computer science student building real-world AI and web applications.")
    college = Column(String, default="Indian Institute of Technology")
    degree = Column(String, default="B.Tech Computer Science & Engineering")
    graduation_year = Column(Integer, default=2027)
    cgpa = Column(Float, default=8.8)
    location = Column(String, default="Bengaluru, India")
    target_role = Column(String, default="Full Stack Developer")
    github_url = Column(String, default="https://github.com/Aadi062")
    linkedin_url = Column(String, default="https://linkedin.com/in/rajat-verma")
    avatar_url = Column(String, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    level = Column(Integer, default=4)
    level_title = Column(String, default="Builder")
    xp = Column(Integer, default=4820)
    xp_max = Column(Integer, default=6000)
    streak_days = Column(Integer, default=12)
    career_readiness_score = Column(Integer, default=82)
    avg_skill_match = Column(Integer, default=84)
    projects_completed_count = Column(Integer, default=5)
    assessments_taken_count = Column(Integer, default=18)
    avg_assessment_score = Column(Integer, default=78)

    # Competency radar scores
    problem_solving = Column(Integer, default=88)
    programming = Column(Integer, default=92)
    data_analysis = Column(Integer, default=76)
    creativity = Column(Integer, default=70)
    communication = Column(Integer, default=65)
    leadership = Column(Integer, default=60)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="student")
    interviews = relationship("InterviewRecord", back_populates="student")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String, index=True)
    description = Column(Text)
    progress_percentage = Column(Integer, default=100)
    status = Column(String, default="Completed") # Completed, In Progress
    tags = Column(String) # comma-separated
    github_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)

    student = relationship("Student", back_populates="projects")

class InterviewRecord(Base):
    __tablename__ = "interview_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    role_target = Column(String, default="Python Developer")
    overall_score = Column(Integer, default=76)
    technical_score = Column(Integer, default=82)
    communication_score = Column(Integer, default=71)
    confidence_score = Column(Integer, default=68)
    completeness_score = Column(Integer, default=78)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="interviews")
