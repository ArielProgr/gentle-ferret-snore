from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, ForeignKey, Index, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel

class Marketplace(Base, BaseModel):
    __tablename__ = "marketplaces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    base_url = Column(String)
    api_endpoint = Column(String, nullable=True)
    is_api_available = Column(Boolean, default=False)
    is_scraping_allowed = Column(Boolean, default=True)
    
    # Relationships
    product_listings = relationship("ProductMarketplace", back_populates="marketplace")

class ProductMarketplace(Base, BaseModel):
    __tablename__ = "product_marketplaces"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    marketplace_id = Column(Integer, ForeignKey("marketplaces.id"))
    listing_url = Column(String)
    upvotes = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    rating = Column(Integer, default=0)  # Out of 5
    price_plans = Column(JSON)  # Array of price plans
    raw_data = Column(JSON)  # Raw data from the marketplace
    is_blocked = Column(Boolean, default=False)
    is_unstable = Column(Boolean, default=False)
    
    # Relationships
    product = relationship("Product", back_populates="marketplaces")
    marketplace = relationship("Marketplace", back_populates="product_listings")
    
    # Snapshot path for raw HTML/data
    snapshot_path = Column(String)

# Indexes for faster queries
Index('idx_product_marketplace_product_id', ProductMarketplace.product_id)
Index('idx_product_marketplace_marketplace_id', ProductMarketplace.marketplace_id)