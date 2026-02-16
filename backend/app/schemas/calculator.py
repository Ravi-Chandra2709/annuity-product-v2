from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class IncomeCalculatorRequest(BaseModel):
    age: int
    gender: str
    state: str
    investment_amount: int
    deferral_years: int = 0
    payout_type: str = "single"
    filters: Optional[Dict[str, Any]] = None


class IncomeCalculatorResponse(BaseModel):
    results: List[Dict[str, Any]]
    total_results: int
    page: int


class GrowthCalculatorRequest(BaseModel):
    age: int
    state: str
    investment_amount: int
    time_horizon: int = 10
    filters: Optional[Dict[str, Any]] = None


class GrowthCalculatorResponse(BaseModel):
    results: List[Dict[str, Any]]
    total_results: int
    page: int
