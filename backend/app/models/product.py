import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

import enum


class ProductType(str, enum.Enum):
    FIA = "FIA"
    RILA = "RILA"
    MYGA = "MYGA"
    SPIA = "SPIA"
    DIA = "DIA"


class AnnuityProduct(Base):
    __tablename__ = "annuity_products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_name = Column(String(255))
    carrier_name = Column(String(255))
    carrier_rating = Column(String(10))
    product_type = Column(SQLEnum(ProductType))
    state_availability = Column(JSONB)
    surrender_period = Column(Integer)
    base_rate = Column(Float)
    cap_rate = Column(Float)
    participation_rate = Column(Float)
    annual_fee = Column(Float)
    has_bonus = Column(Boolean)
    bonus_percentage = Column(Float)
    bonus_vesting_years = Column(Integer)
    minimum_investment = Column(Integer)
    maximum_investment = Column(Integer)
    issue_ages_min = Column(Integer)
    issue_ages_max = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    riders = relationship("IncomeRider", back_populates="product")
    index_options = relationship("IndexOption", back_populates="product")
    historical_performance = relationship("HistoricalPerformance", back_populates="product")


class IncomeRider(Base):
    __tablename__ = "income_riders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("annuity_products.id"), nullable=False)
    rider_name = Column(String(255))
    rider_fee = Column(Float)
    deferral_bonus_rate = Column(Float)
    payout_percentage_single_age_65 = Column(Float)
    payout_percentage_single_age_70 = Column(Float)
    payout_percentage_single_age_75 = Column(Float)
    payout_percentage_joint_age_65 = Column(Float)
    payout_percentage_joint_age_70 = Column(Float)
    payout_percentage_joint_age_75 = Column(Float)
    lifetime_guarantee = Column(Boolean)
    inflation_protection = Column(Boolean)

    product = relationship("AnnuityProduct", back_populates="riders")


class IndexOption(Base):
    __tablename__ = "index_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("annuity_products.id"), nullable=False)
    index_name = Column(String(255))
    index_type = Column(String(100))
    cap_rate = Column(Float)
    participation_rate = Column(Float)
    spread_fee = Column(Float)
    floor_rate = Column(Float)

    product = relationship("AnnuityProduct", back_populates="index_options")


class HistoricalPerformance(Base):
    __tablename__ = "historical_performance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("annuity_products.id"), nullable=False)
    year = Column(Integer)
    credited_rate = Column(Float)
    index_return = Column(Float)
    effective_return = Column(Float)

    product = relationship("AnnuityProduct", back_populates="historical_performance")
