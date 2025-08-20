from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PricePlan(BaseModel):
    name: str
    price: float
    currency: str
    period: str  # monthly, annually, lifetime
    features: List[str]
    is_popular: bool = False

class MarketplaceListing(BaseModel):
    name: str
    listing_url: str
    upvotes: Optional[int] = 0
    reviews_count: Optional[int] = 0
    rating: Optional[float] = 0.0
    price_plans: List[PricePlan] = []
    raw_data: Optional[dict] = None

class TrafficInfo(BaseModel):
    visits_month: Optional[int] = 0
    visits_growth: Optional[float] = 0.0
    bounce_rate: Optional[float] = 0.0
    avg_time_on_site: Optional[float] = 0.0
    traffic_sources: Optional[str] = None

class MrrEstimate(BaseModel):
    mrr_low: float
    mrr_likely: float
    mrr_high: float
    confidence: float
    assumptions: List[str]
    methodology: str

class ProductBase(BaseModel):
    name: str
    canonical_url: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    categories: List[str] = []
    tags: List[str] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    marketplaces: List[MarketplaceListing] = []
    estimates: Optional[MrrEstimate] = None
    traffic: Optional[TrafficInfo] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductList(ProductBase):
    id: int
    created_at: datetime

class ProductResponse(BaseModel):
    product: Product

class ProductListResponse(BaseModel):
    products: List[ProductList]
    total: int
    page: int
    per_page: int