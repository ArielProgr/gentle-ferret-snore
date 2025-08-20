from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel

class Product(Base, BaseModel):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    canonical_url = Column(String, unique=True)
    description = Column(Text)
    logo_url = Column(String)
    categories = Column(JSON)  # Array of categories
    tags = Column(JSON)  # Array of tags
    
    # Relationships
    marketplaces = relationship("ProductMarketplace", back_populates="product")
    estimates = relationship("MrrEstimate", back_populates="product")
    traffic_data = relationship("TrafficData", back_populates="product")
    scrape_logs = relationship("ScrapeLog", back_populates="product")

# Index for faster searches
Index('idx_product_name', Product.name)
Index('idx_product_canonical_url', Product.canonical_url)