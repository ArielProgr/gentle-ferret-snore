from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Marketplace Intelligence"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://marketplace_user:marketplace_password@localhost:5432/marketplace_db"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Scraper settings
    REQUEST_DELAY: float = 1.0  # seconds between requests
    MAX_RETRIES: int = 3
    TIMEOUT: int = 30
    
    # Traffic estimation settings (stub mode)
    SIMILARWEB_STUB_MODE: bool = True
    SIMILARWEB_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()