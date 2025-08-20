from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MarketplaceBase(BaseModel):
    name: str
    base_url: str
    api_endpoint: Optional[str] = None
    is_api_available: bool = False
    is_scraping_allowed: bool = True

class MarketplaceCreate(MarketplaceBase):
    pass

class MarketplaceUpdate(MarketplaceBase):
    pass

class Marketplace(MarketplaceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True