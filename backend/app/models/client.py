import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

import enum


class Gender(str, enum.Enum):
    male = "male"
    female = "female"


class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    client_name = Column(String(255))
    age = Column(Integer)
    gender = Column(SQLEnum(Gender))
    state = Column(String(2))
    investment_amount = Column(Integer)
    goal = Column(String(50))
    risk_tolerance = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="client_profiles")
    saved_comparisons = relationship("SavedComparison", back_populates="client_profile")


class SavedComparison(Base):
    __tablename__ = "saved_comparisons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    client_profile_id = Column(UUID(as_uuid=True), ForeignKey("client_profiles.id"))
    product_ids = Column(JSONB)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="saved_comparisons")
    client_profile = relationship("ClientProfile", back_populates="saved_comparisons")
