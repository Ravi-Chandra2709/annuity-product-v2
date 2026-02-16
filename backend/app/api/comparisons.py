from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("")
def create_comparison(current_user: User = Depends(get_current_user)):
    """Create product comparison. (Stub - full logic in Phase 2)"""
    return {"message": "Comparison endpoint - Phase 2"}


@router.get("/history")
def get_comparison_history(current_user: User = Depends(get_current_user)):
    """Get saved comparisons. (Stub - Phase 2)"""
    return {"items": []}
