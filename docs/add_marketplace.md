# Adding New Marketplaces

This guide explains how to add support for new marketplaces to the Marketplace Intelligence platform.

## Overview

The platform uses a modular scraper architecture that makes it easy to add new marketplaces. Each marketplace has its own scraper implementation that follows a common interface.

## Steps to Add a New Marketplace

### 1. Create a New Scraper

Create a new file in `backend/app/scrapers/` named after your marketplace (e.g., `g2.py`).

```python
from app.scrapers.base import BaseScraper

class G2Scraper(BaseScraper):
    def __init__(self):
        super().__init__("G2")  # Marketplace name
        self.base_url = "https://www.g2.com"
    
    def scrape_product(self, product_url: str) -> dict:
        # Implementation for scraping a single product
        pass
    
    def scrape_products(self, limit: int = 100) -> list:
        # Implementation for scraping multiple products
        pass
```

### 2. Implement Required Methods

Each scraper must implement two key methods:

- `scrape_product(self, product_url: str) -> dict`: Scrapes a single product page
- `scrape_products(self, limit: int = 100) -> list`: Scrapes multiple products

### 3. Use Base Class Utilities

The `BaseScraper` class provides several utility methods:

- `_respect_rate_limit()`: Ensures respectful scraping intervals
- `_log_scrape_attempt()`: Logs scraping attempts to the database
- `_save_snapshot()`: Saves raw HTML for audit purposes

### 4. Handle Data Normalization

Ensure your scraper returns data in the standard format:

```python
{
    'name': 'Product Name',
    'description': 'Product description',
    'url': 'https://marketplace.com/product',
    'upvotes': 150,  # Optional
    'tags': ['tag1', 'tag2'],
    'categories': ['category1'],
    'price_plans': [
        {
            'name': 'Plan Name',
            'price': 29.0,
            'currency': 'USD',
            'period': 'monthly',
            'features': ['Feature 1', 'Feature 2'],
            'is_popular': False
        }
    ]
}
```

### 5. Add API Integration (if available)

If the marketplace offers an API, implement API-based data fetching:

```python
def fetch_product_via_api(self, product_id: str) -> dict:
    # API implementation
    pass
```

### 6. Update Database Integration

Update the ingestion script to handle your new marketplace:

```python
# In scripts/scrape_marketplace.py
from app.scrapers.g2 import G2Scraper

def setup_marketplace(db):
    marketplace = db.query(Marketplace).filter(Marketplace.name == "G2").first()
    if not marketplace:
        marketplace = Marketplace(
            name="G2",
            base_url="https://www.g2.com",
            is_api_available=False,  # Set to True if API is available
            is_scraping_allowed=True
        )
        db.add(marketplace)
        db.commit()
        db.refresh(marketplace)
    return marketplace
```

## Best Practices

### Respectful Scraping

1. Always check `robots.txt` before scraping
2. Implement appropriate delays between requests
3. Handle rate limiting gracefully
4. Identify your scraper with a proper User-Agent

### Data Quality

1. Validate all scraped data
2. Handle missing or malformed data gracefully
3. Normalize data formats (currencies, dates, etc.)
4. Save raw data snapshots for audit purposes

### Error Handling

1. Implement comprehensive error handling
2. Log all scraping attempts with status codes
3. Mark problematic listings as unstable after repeated failures
4. Implement retry mechanisms with exponential backoff

## Example Implementation

Here's a minimal example for a new marketplace scraper:

```python
# backend/app/scrapers/example.py
import time
from typing import List, Dict
from bs4 import BeautifulSoup
from app.scrapers.base import BaseScraper
from app.core.config import settings

class ExampleScraper(BaseScraper):
    def __init__(self):
        super().__init__("Example Marketplace")
        self.base_url = "https://www.example.com"
    
    def scrape_product(self, product_url: str) -> Dict:
        self._respect_rate_limit()
        
        try:
            response = self.session.get(product_url, timeout=settings.TIMEOUT)
            response.raise_for_status()
            
            # Save snapshot
            snapshot_path = self._save_snapshot(response.text, f"example_{int(time.time())}")
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract product information
            product_data = {
                'name': self._extract_name(soup),
                'description': self._extract_description(soup),
                'url': product_url,
                'price_plans': self._extract_price_plans(soup)
            }
            
            # Log successful scrape
            self._log_scrape_attempt(
                url=product_url,
                status_code=response.status_code,
                status="success",
                duration=response.elapsed.total_seconds() * 1000,
                snapshot_path=snapshot_path
            )
            
            return product_data
            
        except Exception as e:
            # Log failed scrape
            self._log_scrape_attempt(
                url=product_url,
                status_code=0,
                status="error",
                duration=0,
                error_message=str(e)
            )
            raise e
    
    def scrape_products(self, limit: int = 100) -> List[Dict]:
        # Implementation for scraping multiple products
        pass
    
    def _extract_name(self, soup: BeautifulSoup) -> str:
        # Implementation for extracting product name
        pass
    
    def _extract_description(self, soup: BeautifulSoup) -> str:
        # Implementation for extracting product description
        pass
    
    def _extract_price_plans(self, soup: BeautifulSoup) -> List[Dict]:
        # Implementation for extracting price plans
        pass
```

## Testing

Create tests for your new scraper in `backend/tests/`:

```python
# backend/tests/test_example_scraper.py
import pytest
from app.scrapers.example import ExampleScraper

def test_example_scraper_initialization():
    scraper = ExampleScraper()
    assert scraper is not None
    assert scraper.marketplace_name == "Example Marketplace"
```

## Next Steps

1. Run your scraper with a small sample to verify functionality
2. Add integration tests
3. Update documentation with marketplace-specific information
4. Add any marketplace-specific configuration to `backend/app/core/config.py`