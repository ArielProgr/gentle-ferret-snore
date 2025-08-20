from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

class BaseModel:
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())