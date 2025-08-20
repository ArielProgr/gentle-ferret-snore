import pytest
from app.services.mrr_estimator import MrrEstimator
from app.schemas.product import MarketplaceListing, PricePlan

def test_mrr_estimator_initialization():
    """Test that MRR estimator can be initialized"""
    estimator = MrrEstimator()
    assert estimator is not None

def test_mrr_estimate_with_basic_data():
    """Test MRR estimation with basic product data"""
    estimator = MrrEstimator()
    
    # Create test data
    product = {
        "name": "Test Product",
        "url": "https://test.com"
    }
    
    marketplaces = [
        MarketplaceListing(
            name="Test Marketplace",
            listing_url="https://test.com/listing",
            price_plans=[
                PricePlan(
                    name="Basic",
                    price=29.0,
                    currency="USD",
                    period="monthly",
                    features=["Feature 1", "Feature 2"]
                )
            ]
        )
    ]
    
    traffic = {
        "visits_month": 10000
    }
    
    # Estimate MRR
    estimate = estimator.estimate_mrr(product, marketplaces, traffic)
    
    # Verify results
    assert estimate.mrr_low >= 0
    assert estimate.mrr_likely >= 0
    assert estimate.mrr_high >= 0
    assert estimate.mrr_low <= estimate.mrr_likely <= estimate.mrr_high
    assert 0 <= estimate.confidence <= 1
    assert len(estimate.assumptions) > 0
    assert estimate.methodology is not None

def test_mrr_estimate_with_high_traffic():
    """Test MRR estimation with high traffic product"""
    estimator = MrrEstimator()
    
    # Create test data with high traffic
    product = {
        "name": "Popular Product",
        "url": "https://popular.com"
    }
    
    marketplaces = [
        MarketplaceListing(
            name="Test Marketplace",
            listing_url="https://popular.com/listing",
            price_plans=[
                PricePlan(
                    name="Premium",
                    price=99.0,
                    currency="USD",
                    period="monthly",
                    features=["Feature 1", "Feature 2", "Feature 3"]
                )
            ]
        )
    ]
    
    traffic = {
        "visits_month": 100000
    }
    
    # Estimate MRR
    estimate = estimator.estimate_mrr(product, marketplaces, traffic)
    
    # Verify results
    assert estimate.mrr_low >= 0
    assert estimate.mrr_likely >= 0
    assert estimate.mrr_high >= 0
    assert estimate.mrr_low <= estimate.mrr_likely <= estimate.mrr_high
    assert 0 <= estimate.confidence <= 1

def test_mrr_estimate_with_multiple_price_plans():
    """Test MRR estimation with multiple price plans"""
    estimator = MrrEstimator()
    
    # Create test data with multiple price plans
    product = {
        "name": "Multi-tier Product",
        "url": "https://multi.com"
    }
    
    marketplaces = [
        MarketplaceListing(
            name="Test Marketplace",
            listing_url="https://multi.com/listing",
            price_plans=[
                PricePlan(
                    name="Basic",
                    price=19.0,
                    currency="USD",
                    period="monthly",
                    features=["Feature 1"]
                ),
                PricePlan(
                    name="Professional",
                    price=99.0,
                    currency="USD",
                    period="monthly",
                    features=["Feature 1", "Feature 2", "Feature 3"],
                    is_popular=True
                ),
                PricePlan(
                    name="Enterprise",
                    price=299.0,
                    currency="USD",
                    period="monthly",
                    features=["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
                )
            ]
        )
    ]
    
    traffic = {
        "visits_month": 50000
    }
    
    # Estimate MRR - should use the highest price plan (Enterprise)
    estimate = estimator.estimate_mrr(product, marketplaces, traffic)
    
    # Verify results
    assert estimate.mrr_low >= 0
    assert estimate.mrr_likely >= 0
    assert estimate.mrr_high >= 0
    assert estimate.mrr_low <= estimate.mrr_likely <= estimate.mrr_high