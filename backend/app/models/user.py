import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

import enum


class UserRole(str, enum.Enum):
    advisor = "advisor"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    company_name = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.advisor)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client_profiles = relationship("ClientProfile", back_populates="user")
    saved_comparisons = relationship("SavedComparison", back_populates="user")
