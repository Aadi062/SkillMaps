import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Support Neon.tech PostgreSQL via environment variable, fallback cleanly to local SQLite (or /tmp on Vercel)
default_sqlite = "/tmp/skillmap.db" if os.getenv("VERCEL") else "./skillmap.db"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{default_sqlite}"
)

# Handle Neon/Render postgres:// vs postgresql:// prefix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

is_sqlite = DATABASE_URL.startswith("sqlite")

connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    global engine, SessionLocal, DATABASE_URL, is_sqlite
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        if is_sqlite:
            raise

        # Keep the web service bootable when a hosted database URL is missing or unavailable.
        # Render logs the original error so the DATABASE_URL can be corrected without hiding it.
        print(f"Database connection unavailable: {exc}")
        DATABASE_URL = "sqlite:///./skillmap.db"
        is_sqlite = True
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)
        SessionLocal.configure(bind=engine)
        Base.metadata.create_all(bind=engine)

    # Ensure newly added columns exist in SQLite if table already existed
    if is_sqlite:
        import sqlite3
        try:
            db_file = DATABASE_URL.replace("sqlite:///", "").replace("sqlite://", "")
            if os.path.exists(db_file):
                conn = sqlite3.connect(db_file)
                cursor = conn.cursor()
                cols = [c[1] for c in cursor.execute("PRAGMA table_info(students)").fetchall()]
                
                columns_to_add = [
                    ("career_goal", "VARCHAR DEFAULT 'Full Stack Developer'"),
                    ("headline", "VARCHAR DEFAULT 'Full Stack & AI Engineer Aspirant'"),
                    ("bio", "TEXT DEFAULT 'Passionate computer science student building real-world AI and web applications.'"),
                    ("college", "VARCHAR DEFAULT 'Indian Institute of Technology'"),
                    ("degree", "VARCHAR DEFAULT 'B.Tech Computer Science & Engineering'"),
                    ("graduation_year", "INTEGER DEFAULT 2027"),
                    ("cgpa", "REAL DEFAULT 8.8"),
                    ("location", "VARCHAR DEFAULT 'Bengaluru, India'"),
                    ("target_role", "VARCHAR DEFAULT 'Full Stack Developer'"),
                    ("github_url", "VARCHAR DEFAULT 'https://github.com/Aadi062'"),
                    ("linkedin_url", "VARCHAR DEFAULT 'https://linkedin.com/in/rajat-verma'")
                ]
                for col_name, col_def in columns_to_add:
                    if col_name not in cols:
                        cursor.execute(f"ALTER TABLE students ADD COLUMN {col_name} {col_def}")
                conn.commit()
                conn.close()
        except Exception as e:
            print(f"Migration note: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

