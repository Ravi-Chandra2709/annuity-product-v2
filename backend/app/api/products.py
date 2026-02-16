from uuid import UUID
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.product import AnnuityProduct, IncomeRider, IndexOption, HistoricalPerformance
from app.schemas.product import (
    ProductResponse,
    ProductListResponse,
    IncomeRiderResponse,
    IndexOptionResponse,
    HistoricalPerformanceResponse,
)

router = APIRouter()


@router.get("", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    product_type: Optional[str] = Query(None),
    carrier_rating: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    min_rate: Optional[float] = Query(None),
    max_fee: Optional[float] = Query(None),
    surrender_period: Optional[int] = Query(None),
    min_investment: Optional[int] = Query(None),
    max_investment: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """List annuity products with optional filters."""
    query = db.query(AnnuityProduct)

    if product_type:
        query = query.filter(AnnuityProduct.product_type == product_type)
    if carrier_rating:
        query = query.filter(AnnuityProduct.carrier_rating == carrier_rating)
    if state:
        query = query.filter(
            or_(
                AnnuityProduct.state_availability.is_(None),
                AnnuityProduct.state_availability.contains([state]),
            )
        )
    if min_rate is not None:
        query = query.filter(AnnuityProduct.base_rate >= min_rate)
    if max_fee is not None:
        query = query.filter(AnnuityProduct.annual_fee <= max_fee)
    if surrender_period is not None:
        query = query.filter(AnnuityProduct.surrender_period <= surrender_period)
    if min_investment is not None:
        query = query.filter(
            or_(
                AnnuityProduct.minimum_investment.is_(None),
                AnnuityProduct.minimum_investment <= min_investment,
            )
        )
    if max_investment is not None:
        query = query.filter(
            or_(
                AnnuityProduct.maximum_investment.is_(None),
                AnnuityProduct.maximum_investment >= max_investment,
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    total_pages = (total + limit - 1) // limit

    return ProductListResponse(
        items=products,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    product = db.query(AnnuityProduct).filter(AnnuityProduct.id == product_id).first()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/{product_id}/riders", response_model=List[IncomeRiderResponse])
def get_product_riders(product_id: UUID, db: Session = Depends(get_db)):
    """Get income riders for a product."""
    riders = db.query(IncomeRider).filter(IncomeRider.product_id == product_id).all()
    return riders


@router.get("/{product_id}/index-options", response_model=List[IndexOptionResponse])
def get_product_index_options(product_id: UUID, db: Session = Depends(get_db)):
    """Get index options for a product."""
    options = db.query(IndexOption).filter(IndexOption.product_id == product_id).all()
    return options


@router.get("/{product_id}/historical-performance", response_model=List[HistoricalPerformanceResponse])
def get_product_historical_performance(product_id: UUID, db: Session = Depends(get_db)):
    """Get historical performance for a product."""
    perf = db.query(HistoricalPerformance).filter(
        HistoricalPerformance.product_id == product_id
    ).order_by(HistoricalPerformance.year).all()
    return perf
