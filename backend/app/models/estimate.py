from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel

class MrrEstimate(Base, BaseModel):
    __tablename__ = "mrr_estimates"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    mrr_low = Column(Float)
    mrr_likely = Column(Float)
    mrr_high = Column(Float)
    confidence = Column(Float)  # 0.0 to 1.0
    assumptions = Column(JSON)  # Array of assumptions used
    methodology = Column(String)  # Description of how estimate was calculated
    
    # Relationships
    product = relationship("Product", back_populates="estimates")