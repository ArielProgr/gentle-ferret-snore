from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class ScrapeLog(Base):
    __tablename__ = "scrape_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    marketplace_id = Column(Integer, ForeignKey("marketplaces.id"))
    url = Column(String)
    status_code = Column(Integer)
    status = Column(String)  # success, blocked, timeout, error
    duration = Column(Integer)  # In milliseconds
    error_message = Column(Text, nullable=True)
    snapshot_path = Column(String, nullable=True)  # Path to raw data snapshot
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="scrape_logs")
    marketplace = relationship("Marketplace")