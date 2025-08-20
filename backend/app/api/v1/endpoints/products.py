from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.product import Product
from app.models.marketplace import ProductMarketplace, Marketplace
from app.models.estimate import MrrEstimate
from app.models.traffic import TrafficData
from app.schemas.product import ProductResponse, ProductListResponse, Product
from app.services.mrr_estimator import MrrEstimator
from app.services.traffic_estimator import TrafficEstimator

router = APIRouter()

@router.get("/", response_model=ProductListResponse)
def list_products(
    skip: int = 0,
    limit: int = 50,
    category: str = None,
    tag: str = None,
    min_mrr: float = None,
    max_mrr: float = None,
    db: Session = Depends(get_db)
):
    """List products with optional filtering"""
    query = db.query(Product)
    
    # Apply filters
    if category:
        query = query.filter(Product.categories.contains([category]))
    
    if tag:
        query = query.filter(Product.tags.contains([tag]))
    
    if min_mrr is not None or max_mrr is not None:
        query = query.join(MrrEstimate)
        if min_mrr is not None:
            query = query.filter(MrrEstimate.mrr_likely >= min_mrr)
        if max_mrr is not None:
            query = query.filter(MrrEstimate.mrr_likely <= max_mrr)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    
    return ProductListResponse(
        products=products,
        total=total,
        page=skip // limit + 1,
        per_page=limit
    )

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get detailed information for a specific product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get marketplace listings
    marketplace_listings = db.query(ProductMarketplace).filter(
        ProductMarketplace.product_id == product_id
    ).all()
    
    # Get marketplace details
    marketplaces = []
    for listing in marketplace_listings:
        marketplace = db.query(Marketplace).filter(
            Marketplace.id == listing.marketplace_id
        ).first()
        
        if marketplace:
            marketplaces.append({
                "name": marketplace.name,
                "listing_url": listing.listing_url,
                "upvotes": listing.upvotes,
                "reviews_count": listing.reviews_count,
                "rating": listing.rating,
                "price_plans": listing.price_plans or []
            })
    
    # Get MRR estimate
    estimate = db.query(MrrEstimate).filter(MrrEstimate.product_id == product_id).first()
    
    # Get traffic data
    traffic = db.query(TrafficData).filter(TrafficData.product_id == product_id).first()
    
    # Convert to response format
    product_response = Product(
        id=product.id,
        name=product.name,
        canonical_url=product.canonical_url,
        description=product.description,
        logo_url=product.logo_url,
        categories=product.categories or [],
        tags=product.tags or [],
        marketplaces=marketplaces,
        estimates=estimate,
        traffic={
            "visits_month": traffic.visits_month if traffic else 0,
            "visits_growth": traffic.visits_growth if traffic else 0.0,
            "bounce_rate": traffic.bounce_rate if traffic else 0.0,
            "avg_time_on_site": traffic.avg_time_on_site if traffic else 0.0,
            "traffic_sources": traffic.traffic_sources if traffic else None
        } if traffic else None,
        created_at=product.created_at,
        updated_at=product.updated_at
    )
    
    return ProductResponse(product=product_response)

@router.get("/search/", response_model=ProductListResponse)
def search_products(
    q: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Search products by name, description, tags, or categories"""
    query = db.query(Product).filter(
        Product.name.ilike(f"%{q}%") |
        Product.description.ilike(f"%{q}%") |
        Product.tags.contains([q]) |
        Product.categories.contains([q])
    )
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    
    return ProductListResponse(
        products=products,
        total=total,
        page=skip // limit + 1,
        per_page=limit
    )

@router.get("/{product_id}/estimates")
def get_product_estimates(product_id: int, db: Session = Depends(get_db)):
    """Get MRR estimates for a specific product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    estimate = db.query(MrrEstimate).filter(MrrEstimate.product_id == product_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimates not found for this product")
    
    return estimate