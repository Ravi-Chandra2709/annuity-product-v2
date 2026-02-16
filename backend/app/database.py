from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Supabase requires SSL; add connect_args when using Supabase
engine_args = {}
if "supabase" in (settings.DATABASE_URL or "").lower():
    engine_args["connect_args"] = {"sslmode": "require"}

engine = create_engine(
    settings.DATABASE_URL,
    **engine_args,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for getting database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
