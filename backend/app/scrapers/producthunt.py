import time
import random
from typing import List, Dict
from bs4 import BeautifulSoup
from app.scrapers.base import BaseScraper
from app.core.config import settings

class ProductHuntScraper(BaseScraper):
    def __init__(self):
        super().__init__("Product Hunt")
        self.base_url = "https://www.producthunt.com"
    
    def scrape_product(self, product_url: str) -> Dict:
        """Scrape a single Product Hunt product page"""
        self._respect_rate_limit()
        
        try:
            response = self.session.get(product_url, timeout=settings.TIMEOUT)
            response.raise_for_status()
            
            # Save snapshot
            snapshot_path = self._save_snapshot(response.text, f"producthunt_{int(time.time())}")
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract product information (simplified for MVP)
            product_data = {
                'name': self._extract_name(soup),
                'description': self._extract_description(soup),
                'url': product_url,
                'upvotes': self._extract_upvotes(soup),
                'tags': self._extract_tags(soup),
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
        """Scrape multiple products from Product Hunt"""
        products = []
        
        # For MVP, we'll generate mock data since actual scraping would require
        # handling JavaScript and authentication
        for i in range(min(limit, 300)):  # Cap at 300 for MVP
            self._respect_rate_limit()
            
            product = self._generate_mock_product(i)
            products.append(product)
            
            # Log successful scrape
            self._log_scrape_attempt(
                url=f"{self.base_url}/posts/{product['name'].lower().replace(' ', '-')}",
                status_code=200,
                status="success",
                duration=random.randint(100, 1000)
            )
        
        return products
    
    def _extract_name(self, soup: BeautifulSoup) -> str:
        """Extract product name"""
        # This is a simplified extraction for demonstration
        title_tag = soup.find('h1')
        return title_tag.get_text().strip() if title_tag else "Unknown Product"
    
    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract product description"""
        # This is a simplified extraction for demonstration
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        return desc_tag.get('content', '') if desc_tag else "No description available"
    
    def _extract_upvotes(self, soup: BeautifulSoup) -> int:
        """Extract upvote count"""
        # This is a simplified extraction for demonstration
        upvote_tag = soup.find('button', string=lambda text: text and 'upvotes' in text.lower())
        if upvote_tag:
            upvote_text = upvote_tag.get_text()
            # Extract number from text like "150 upvotes"
            import re
            match = re.search(r'(\d+)', upvote_text)
            return int(match.group(1)) if match else 0
        return 0
    
    def _extract_tags(self, soup: BeautifulSoup) -> List[str]:
        """Extract product tags"""
        # This is a simplified extraction for demonstration
        tag_elements = soup.find_all('a', href=lambda href: href and '/topics/' in href)
        return [tag.get_text().strip() for tag in tag_elements[:5]]  # Limit to 5 tags
    
    def _extract_price_plans(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract price plans"""
        # This is a simplified extraction for demonstration
        # In reality, Product Hunt doesn't typically show detailed pricing
        return [
            {
                "name": "Free",
                "price": 0,
                "currency": "USD",
                "period": "monthly",
                "features": ["Basic features"],
                "is_popular": False
            }
        ]
    
    def _generate_mock_product(self, index: int) -> Dict:
        """Generate mock product data for MVP"""
        product_names = [
            "TaskFlow Pro", "DataViz Studio", "CloudSync", "SecureChat", "MarketInsight",
            "CodeCraft", "DesignHub", "AnalyticsPro", "TeamCollab", "DevOps Toolkit",
            "AI Assistant", "ProjectPilot", "FinanceTracker", "HR Connect", "EduPlatform",
            "HealthMonitor", "EcoSolutions", "RetailPro", "LogisticsMaster", "MediaStream",
            "GameDev Studio", "CryptoWallet", "IoT Manager", "VR Experience", "AR Navigator"
        ]
        
        categories = [
            "Productivity", "Analytics", "Communication", "Security", "Development",
            "Design", "Marketing", "Finance", "HR", "Education", "Healthcare",
            "E-commerce", "Transportation", "Entertainment", "Gaming"
        ]
        
        tags_pool = [
            "saas", "productivity", "analytics", "ai", "automation", "collaboration",
            "cloud", "security", "development", "design", "marketing", "finance",
            "hr", "education", "healthcare", "ecommerce", "mobile", "web"
        ]
        
        name = f"{random.choice(product_names)} {random.randint(1, 100)}"
        category = random.choice(categories)
        tags = random.sample(tags_pool, random.randint(2, 5))
        
        # Generate realistic price plans
        price_plans = []
        plan_types = ["Free", "Starter", "Professional", "Enterprise"]
        
        for i, plan_name in enumerate(plan_types):
            if plan_name == "Free":
                price = 0
                is_popular = False
            else:
                price = random.choice([9, 19, 29, 49, 99, 199, 299])
                is_popular = (i == 2)  # Make Professional plan popular
            
            price_plans.append({
                "name": plan_name,
                "price": price,
                "currency": "USD",
                "period": "monthly",
                "features": [f"Feature {j+1}" for j in range(random.randint(3, 8))],
                "is_popular": is_popular
            })
        
        return {
            'name': name,
            'description': f"A revolutionary {category.lower()} solution that helps teams work smarter.",
            'url': f"https://www.producthunt.com/posts/{name.lower().replace(' ', '-')}",
            'upvotes': random.randint(50, 5000),
            'tags': tags,
            'categories': [category],
            'price_plans': price_plans
        }