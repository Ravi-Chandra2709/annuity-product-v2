from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime


class IncomeRiderResponse(BaseModel):
    id: UUID
    rider_name: Optional[str] = None
    rider_fee: Optional[float] = None
    deferral_bonus_rate: Optional[float] = None
    payout_percentage_single_age_65: Optional[float] = None
    payout_percentage_single_age_70: Optional[float] = None
    payout_percentage_single_age_75: Optional[float] = None
    payout_percentage_joint_age_65: Optional[float] = None
    payout_percentage_joint_age_70: Optional[float] = None
    payout_percentage_joint_age_75: Optional[float] = None
    lifetime_guarantee: Optional[bool] = None
    inflation_protection: Optional[bool] = None

    class Config:
        from_attributes = True


class IndexOptionResponse(BaseModel):
    id: UUID
    index_name: Optional[str] = None
    index_type: Optional[str] = None
    cap_rate: Optional[float] = None
    participation_rate: Optional[float] = None
    spread_fee: Optional[float] = None
    floor_rate: Optional[float] = None

    class Config:
        from_attributes = True


class HistoricalPerformanceResponse(BaseModel):
    id: UUID
    year: Optional[int] = None
    credited_rate: Optional[float] = None
    index_return: Optional[float] = None
    effective_return: Optional[float] = None

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: UUID
    product_name: Optional[str] = None
    carrier_name: Optional[str] = None
    carrier_rating: Optional[str] = None
    product_type: Optional[str] = None
    state_availability: Optional[list] = None
    surrender_period: Optional[int] = None
    base_rate: Optional[float] = None
    cap_rate: Optional[float] = None
    participation_rate: Optional[float] = None
    annual_fee: Optional[float] = None
    has_bonus: Optional[bool] = None
    bonus_percentage: Optional[float] = None
    bonus_vesting_years: Optional[int] = None
    minimum_investment: Optional[int] = None
    maximum_investment: Optional[int] = None
    issue_ages_min: Optional[int] = None
    issue_ages_max: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
