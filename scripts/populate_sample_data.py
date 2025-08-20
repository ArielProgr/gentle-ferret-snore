#!/usr/bin/env python3
"""
Script to populate the database with sample data for development/testing
"""

import sys
import os
import random

# Add backend to path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.database import SessionLocal
from app.models.product import Product
from app.models.marketplace import Marketplace, ProductMarketplace
from app.models.estimate import MrrEstimate
from app.models.traffic import TrafficData

def create_sample_data(db):
    """Create sample data for development/testing"""
    
    # Create marketplaces
    marketplaces_data = [
        {"name": "Product Hunt", "base_url": "https://www.producthunt.com"},
        {"name": "G2", "base_url": "https://www.g2.com"},
        {"name": "AppSumo", "base_url": "https://www.appsumo.com"}
    ]
    
    marketplaces = []
    for mp_data in marketplaces_data:
        marketplace = db.query(Marketplace).filter(Marketplace.name == mp_data["name"]).first()
        if not marketplace:
            marketplace = Marketplace(**mp_data)
            db.add(marketplace)
            db.flush()
        marketplaces.append(marketplace)
    
    # Create sample products
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
    
    created_products = []
    
    for i in range(50):  # Create 50 sample products
        name = f"{random.choice(product_names)} {random.randint(1, 100)}"
        category = random.choice(categories)
        tags = random.sample(tags_pool, random.randint(2, 5))
        
        # Check if product already exists
        existing_product = db.query(Product).filter(Product.name == name).first()
        if existing_product:
            product = existing_product
        else:
            product = Product(
                name=name,
                canonical_url=f"https://example.com/products/{name.lower().replace(' ', '-')}",
                description=f"A revolutionary {category.lower()} solution that helps teams work smarter.",
                categories=[category],
                tags=tags
            )
            db.add(product)
            db.flush()
            created_products.append(product)
    
    # Create marketplace listings for products
    for product in created_products:
        for marketplace in marketplaces:
            # Check if listing already exists
            existing_listing = db.query(ProductMarketplace).filter(
                ProductMarketplace.product_id == product.id,
                ProductMarketplace.marketplace_id == marketplace.id
            ).first()
            
            if not existing_listing:
                # Generate realistic price plans
                price_plans = []
                plan_types = ["Free", "Starter", "Professional", "Enterprise"]
                
                for j, plan_name in enumerate(plan_types):
                    if plan_name == "Free":
                        price = 0
                        is_popular = False
                    else:
                        price = random.choice([9, 19, 29, 49, 99, 199, 299])
                        is_popular = (j == 2)  # Make Professional plan popular
                    
                    price_plans.append({
                        "name": plan_name,
                        "price": price,
                        "currency": "USD",
                        "period": "monthly",
                        "features": [f"Feature {k+1}" for k in range(random.randint(3, 8))],
                        "is_popular": is_popular
                    })
                
                listing = ProductMarketplace(
                    product_id=product.id,
                    marketplace_id=marketplace.id,
                    listing_url=f"{marketplace.base_url}/products/{product.name.lower().replace(' ', '-')}",
                    upvotes=random.randint(50, 5000),
                    reviews_count=random.randint(10, 500),
                    rating=random.uniform(3.0, 5.0),
                    price_plans=price_plans
                )
                db.add(listing)
    
    # Create traffic data for products
    for product in created_products:
        # Check if traffic data already exists
        existing_traffic = db.query(TrafficData).filter(TrafficData.product_id == product.id).first()
        
        if not existing_traffic:
            traffic_data = TrafficData(
                product_id=product.id,
                visits_month=random.randint(1000, 1000000),
                visits_growth=round(random.uniform(-20.0, 50.0), 2),
                bounce_rate=round(random.uniform(20.0, 80.0), 2),
                avg_time_on_site=round(random.uniform(30.0, 300.0), 2),
                traffic_sources='{"direct": 30, "search": 50, "referral": 20}'
            )
            db.add(traffic_data)
    
    # Create MRR estimates for products
    for product in created_products:
        # Check if estimate already exists
        existing_estimate = db.query(MrrEstimate).filter(MrrEstimate.product_id == product.id).first()
        
        if not existing_estimate:
            # Get the highest price plan
            listings = db.query(ProductMarketplace).filter(ProductMarketplace.product_id == product.id).all()
            highest_price = 0.0
            
            for listing in listings:
                if listing.price_plans:
                    for plan in listing.price_plans:
                        if plan["price"] > highest_price:
                            highest_price = plan["price"]
            
            # Get traffic data
            traffic = db.query(TrafficData).filter(TrafficData.product_id == product.id).first()
            visits_month = traffic.visits_month if traffic else 10000
            
            # Simple estimation model
            if visits_month > 100000:
                conversion_rate = 0.005
            elif visits_month > 10000:
                conversion_rate = 0.01
            elif visits_month > 1000:
                conversion_rate = 0.02
            else:
                conversion_rate = 0.03
            
            estimated_customers = max(1, int(visits_month * conversion_rate))
            mrr_likely = highest_price * estimated_customers
            mrr_low = mrr_likely * 0.5
            mrr_high = mrr_likely * 1.5
            confidence = min(1.0, visits_month / 100000.0)
            
            assumptions = [
                f"Conversion rate estimated at {conversion_rate*100:.2f}% based on {visits_month} monthly visits",
                f"Estimated {estimated_customers} customers based on traffic and conversion rate",
                f"Highest price plan of ${highest_price} used as baseline",
                "Assumes SaaS business model with monthly recurring revenue",
                "Does not account for churn, expansion revenue, or enterprise deals"
            ]
            
            estimate = MrrEstimate(
                product_id=product.id,
                mrr_low=round(mrr_low, 2),
                mrr_likely=round(mrr_likely, 2),
                mrr_high=round(mrr_high, 2),
                confidence=round(confidence, 2),
                assumptions=assumptions,
                methodology="Rule-based estimation using traffic data and pricing information"
            )
            db.add(estimate)
    
    db.commit()
    return len(created_products)

def main():
    print("Populating database with sample data...")
    
    db = SessionLocal()
    try:
        count = create_sample_data(db)
        print(f"Successfully created/updated {count} sample products")
        print("Sample data population completed!")
    except Exception as e:
        print(f"Error populating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()