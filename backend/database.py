import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Support Neon.tech PostgreSQL via environment variable, fallback cleanly to local SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./skillmap.db"
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
                if "career_goal" not in cols:
                    cursor.execute("ALTER TABLE students ADD COLUMN career_goal VARCHAR DEFAULT 'Full Stack Developer'")
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

