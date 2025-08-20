from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel

class TrafficData(Base, BaseModel):
    __tablename__ = "traffic_data"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    visits_month = Column(Integer)  # Monthly visits
    visits_growth = Column(Float)  # Month-over-month growth %
    bounce_rate = Column(Float)  # Percentage
    avg_time_on_site = Column(Float)  # In seconds
    traffic_sources = Column(String)  # JSON string of traffic sources
    
    # Relationships
    product = relationship("Product", back_populates="traffic_data")