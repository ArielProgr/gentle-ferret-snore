#!/usr/bin/env python3
"""
Product Hunt scraper script for Marketplace Intelligence
"""

import argparse
import sys
import os

# Add backend to path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.scrapers.producthunt import ProductHuntScraper
from app.core.database import SessionLocal
from app.models.product import Product
from app.models.marketplace import Marketplace, ProductMarketplace
from app.models.estimate import MrrEstimate
from app.models.traffic import TrafficData
from app.services.mrr_estimator import MrrEstimator
from app.services.traffic_estimator import TrafficEstimator

def setup_marketplace(db):
    """Ensure Product Hunt marketplace exists in database"""
    marketplace = db.query(Marketplace).filter(Marketplace.name == "Product Hunt").first()
    if not marketplace:
        marketplace = Marketplace(
            name="Product Hunt",
            base_url="https://www.producthunt.com",
            is_api_available=False,
            is_scraping_allowed=True
        )
        db.add(marketplace)
        db.commit()
        db.refresh(marketplace)
    return marketplace

def save_products_to_db(products, db):
    """Save scraped products to database"""
    marketplace = setup_marketplace(db)
    mrr_estimator = MrrEstimator()
    traffic_estimator = TrafficEstimator()
    
    saved_count = 0
    for product_data in products:
        try:
            # Check if product already exists
            existing_product = db.query(Product).filter(
                Product.canonical_url == product_data['url']
            ).first()
            
            if existing_product:
                # Update existing product
                existing_product.name = product_data['name']
                existing_product.description = product_data['description']
                existing_product.tags = product_data.get('tags', [])
                existing_product.categories = product_data.get('categories', [])
                product_obj = existing_product
            else:
                # Create new product
                product_obj = Product(
                    name=product_data['name'],
                    canonical_url=product_data['url'],
                    description=product_data['description'],
                    tags=product_data.get('tags', []),
                    categories=product_data.get('categories', [])
                )
                db.add(product_obj)
                db.flush()  # Get the ID without committing
            
            # Save marketplace listing
            product_marketplace = ProductMarketplace(
                product_id=product_obj.id,
                marketplace_id=marketplace.id,
                listing_url=product_data['url'],
                upvotes=product_data.get('upvotes', 0),
                price_plans=product_data.get('price_plans', [])
            )
            db.add(product_marketplace)
            
            # Generate and save traffic estimate
            traffic_data = traffic_estimator.estimate_traffic(product_data['url'])
            traffic_obj = TrafficData(
                product_id=product_obj.id,
                visits_month=traffic_data.visits_month,
                visits_growth=traffic_data.visits_growth,
                bounce_rate=traffic_data.bounce_rate,
                avg_time_on_site=traffic_data.avg_time_on_site,
                traffic_sources=traffic_data.traffic_sources
            )
            db.add(traffic_obj)
            
            # Generate and save MRR estimate
            marketplace_listings = [{
                "name": marketplace.name,
                "listing_url": product_data['url'],
                "price_plans": product_data.get('price_plans', [])
            }]
            
            mrr_estimate_data = mrr_estimator.estimate_mrr(
                product_data, 
                marketplace_listings, 
                {
                    "visits_month": traffic_data.visits_month,
                    "visits_growth": traffic_data.visits_growth
                }
            )
            
            mrr_estimate = MrrEstimate(
                product_id=product_obj.id,
                mrr_low=mrr_estimate_data.mrr_low,
                mrr_likely=mrr_estimate_data.mrr_likely,
                mrr_high=mrr_estimate_data.mrr_high,
                confidence=mrr_estimate_data.confidence,
                assumptions=mrr_estimate_data.assumptions,
                methodology=mrr_estimate_data.methodology
            )
            db.add(mrr_estimate)
            
            saved_count += 1
            
        except Exception as e:
            print(f"Error saving product {product_data.get('name', 'Unknown')}: {e}")
            db.rollback()
            continue
    
    db.commit()
    return saved_count

def main():
    parser = argparse.ArgumentParser(description="Scrape Product Hunt products")
    parser.add_argument("--sample", type=int, default=50, help="Number of products to scrape (default: 50)")
    parser.add_argument("--limit", type=int, default=300, help="Maximum number of products (default: 300)")
    
    args = parser.parse_args()
    
    # Validate arguments
    sample_size = min(args.sample, args.limit)
    
    print(f"Starting Product Hunt scraper with sample size: {sample_size}")
    
    # Initialize scraper
    scraper = ProductHuntScraper()
    
    try:
        # Scrape products
        print("Scraping products...")
        products = scraper.scrape_products(limit=sample_size)
        print(f"Scraped {len(products)} products")
        
        # Save to database
        print("Saving products to database...")
        db = SessionLocal()
        try:
            saved_count = save_products_to_db(products, db)
            print(f"Successfully saved {saved_count} products to database")
        finally:
            db.close()
        
        # Print sample JSON output
        if products:
            print("\nSample JSON output:")
            sample_product = products[0]
            print("{")
            print(f'  "id": 1,')
            print(f'  "name": "{sample_product["name"]}",')
            print(f'  "canonical_url": "{sample_product["url"]}",')
            print('  "marketplaces": [')
            print('    {')
            print('      "name": "Product Hunt",')
            print(f'      "listing_url": "{sample_product["url"]}",')
            print(f'      "upvotes": {sample_product.get("upvotes", 0)},')
            print('      "price_plans": [')
            
            # Print first price plan as example
            if sample_product.get("price_plans"):
                plan = sample_product["price_plans"][0]
                print('        {')
                print(f'          "name": "{plan["name"]}",')
                print(f'          "price": {plan["price"]},')
                print(f'          "currency": "{plan["currency"]}",')
                print(f'          "period": "{plan["period"]}",')
                print(f'          "features": {plan["features"][:3]}...,')
                print(f'          "is_popular": {plan["is_popular"]}')
                print('        }')
            
            print('      ]')
            print('    }')
            print('  ],')
            print('  "estimates": {')
            print('    "mrr_low": 500,')
            print('    "mrr_likely": 1500,')
            print('    "mrr_high": 3000,')
            print('    "confidence": 0.75,')
            print('    "assumptions": ["Assumption 1", "Assumption 2"]')
            print('  },')
            print('  "traffic": {')
            print('    "visits_month": 10000')
            print('  }')
            print("}")
            
    except Exception as e:
        print(f"Error during scraping: {e}")
        sys.exit(1)
    
    print("\nScraping completed successfully!")

if __name__ == "__main__":
    main()