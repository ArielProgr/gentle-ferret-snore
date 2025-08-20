# Adding New Marketplaces

This guide explains how to add support for new marketplaces to the Marketplace Intelligence platform.

## Overview

The platform uses a modular scraper architecture that makes it easy to add new marketplaces. Each marketplace has its own scraper class that implements the `BaseScraper` interface.

## Steps to Add a New Marketplace

### 1. Create a New Scraper Class

Create a new file in `backend/app/scrapers/` named after your marketplace (e.g., `g2.py`).

```python
from app.scrapers.base import BaseScraper
from typing import List, Dict

class G2Scraper(BaseScraper):
    def __init__(self):
        super().__init__("G2")  # Marketplace name
        self.base_url = "https://www.g2.com"
    
    def scrape_product(self, product_url: str) -> Dict:
        # Implement single product scraping logic
        pass
    
    def scrape_products(self, limit: int = 100) -> List[Dict]:
        # Implement bulk product scraping logic
        pass
```

### 2. Implement Required Methods

Your scraper must implement two key methods:

- `scrape_product(self, product_url: str) -> Dict`: Scrapes a single product page
- `scrape_products(self, limit: int = 100) -> List[Dict]`: Scrapes multiple products

### 3. Return Data Format

Each scraper should return product data in the following format:

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
            "name": "Basic",
            "price": 29.0,
            "currency": "USD",
            "period": "monthly",
            "features": ["Feature 1", "Feature 2"],
            "is_popular": False
        }
    ]
}
```

### 4. Respect Rate Limits

Use the built-in rate limiting mechanism:

```python
def scrape_product(self, product_url: str) -> Dict:
    self._respect_rate_limit()  # Automatically waits based on config
    # Your scraping logic here
```

### 5. Save Raw Data Snapshots

For audit purposes, save raw HTML content:

```python
snapshot_path = self._save_snapshot(response.text, f"g2_product_{product_id}")
```

### 6. Log Scraping Attempts

Record all scraping attempts for monitoring:

```python
self._log_scrape_attempt(
    url=product_url,
    status_code=response.status_code,
    status="success",  # or "blocked", "timeout", "error"
    duration=response.elapsed.total_seconds() * 1000,
    snapshot_path=snapshot_path
)
```

## API Integration

If the marketplace provides an API, prefer API integration over scraping:

1. Check for official APIs first
2. Implement API client in the scraper
3. Fall back to scraping only if API is not available or sufficient

## Configuration

Add any marketplace-specific configuration to `backend/app/core/config.py`:

```python
class Settings(BaseSettings):
    # ... existing settings ...
    G2_API_KEY: str = ""
    G2_API_ENDPOINT: str = "https://api.g2.com"
```

## Testing

Create tests for your new scraper in `backend/tests/`:

```python
def test_g2_scraper_initialization():
    scraper = G2Scraper()
    assert scraper is not None
```

## Integration with Ingestion Pipeline

The ingestion script (`scripts/scrape_marketplace.py`) can be used as a template for creating marketplace-specific ingestion scripts.

## Best Practices

1. **Respect robots.txt** and terms of service
2. **Implement retries** with exponential backoff
3. **Handle errors gracefully** and log appropriately
4. **Use appropriate User-Agent** headers
5. **Cache data** when possible to reduce requests
6. **Monitor rate limits** and adjust accordingly
7. **Save snapshots** of raw data for debugging
8. **Implement proper data validation** before saving to database

## Example Implementation

For a complete example, refer to the existing Product Hunt scraper at `backend/app/scrapers/producthunt.py`.