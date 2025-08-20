import time
import requests
from typing import Optional
from abc import ABC, abstractmethod
from app.core.config import settings
from app.models.scrape_log import ScrapeLog
from app.core.database import SessionLocal

class BaseScraper(ABC):
    def __init__(self, marketplace_name: str):
        self.marketplace_name = marketplace_name
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Marketplace Intelligence Bot 1.0'
        })
        self.delay = settings.REQUEST_DELAY
    
    def _respect_rate_limit(self):
        """Respect rate limits by adding delay between requests"""
        time.sleep(self.delay)
    
    def _log_scrape_attempt(self, url: str, status_code: int, status: str, 
                           duration: int, error_message: Optional[str] = None,
                           snapshot_path: Optional[str] = None, product_id: Optional[int] = None):
        """Log scrape attempt to database"""
        db = SessionLocal()
        try:
            # Get marketplace ID
            from app.models.marketplace import Marketplace
            marketplace = db.query(Marketplace).filter(Marketplace.name == self.marketplace_name).first()
            marketplace_id = marketplace.id if marketplace else None
            
            log_entry = ScrapeLog(
                product_id=product_id,
                marketplace_id=marketplace_id,
                url=url,
                status_code=status_code,
                status=status,
                duration=duration,
                error_message=error_message,
                snapshot_path=snapshot_path
            )
            db.add(log_entry)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error logging scrape attempt: {e}")
        finally:
            db.close()
    
    def _save_snapshot(self, content: str, filename: str) -> str:
        """Save raw content snapshot to file"""
        import os
        from datetime import datetime
        
        # Create directory if it doesn't exist
        snapshot_dir = "data/raw"
        os.makedirs(snapshot_dir, exist_ok=True)
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = f"{snapshot_dir}/{filename}_{timestamp}.html"
        
        # Save content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return filepath
    
    @abstractmethod
    def scrape_product(self, product_url: str) -> dict:
        """Scrape a single product page"""
        pass
    
    @abstractmethod
    def scrape_products(self, limit: int = 100) -> list:
        """Scrape multiple products"""
        pass