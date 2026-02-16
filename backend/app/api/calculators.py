from fastapi import APIRouter, Depends
from app.schemas.calculator import (
    IncomeCalculatorRequest,
    IncomeCalculatorResponse,
    GrowthCalculatorRequest,
    GrowthCalculatorResponse,
)
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/income", response_model=IncomeCalculatorResponse)
def calculate_income(
    data: IncomeCalculatorRequest,
    current_user: User = Depends(get_current_user),
):
    """Calculate income from annuity products. (Stub - full logic in Phase 2)"""
    return IncomeCalculatorResponse(
        results=[],
        total_results=0,
        page=1,
    )


@router.post("/growth", response_model=GrowthCalculatorResponse)
def calculate_growth(
    data: GrowthCalculatorRequest,
    current_user: User = Depends(get_current_user),
):
    """Calculate growth projection. (Stub - full logic in Phase 2)"""
    return GrowthCalculatorResponse(
        results=[],
        total_results=0,
        page=1,
    )
