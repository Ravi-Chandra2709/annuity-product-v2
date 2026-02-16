from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.config import get_settings

settings = get_settings()
db_url = settings.DATABASE_URL or ""

# Supabase: SSL and NullPool for connection pooler (port 6543)
engine_args = {}
if "supabase" in db_url.lower():
    engine_args["connect_args"] = {"sslmode": "require"}
    if "pooler.supabase.com" in db_url or ":6543" in db_url:
        # Transaction-mode pooler: use NullPool per Supabase docs
        engine_args["poolclass"] = NullPool

engine = create_engine(
    db_url,
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
