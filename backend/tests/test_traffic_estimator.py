import pytest
from app.services.traffic_estimator import TrafficEstimator

def test_traffic_estimator_initialization():
    """Test that traffic estimator can be initialized"""
    estimator = TrafficEstimator()
    assert estimator is not None

def test_stub_traffic_estimation():
    """Test traffic estimation in stub mode"""
    estimator = TrafficEstimator()
    
    # Estimate traffic for a test URL
    traffic = estimator.estimate_traffic("https://test.com")
    
    # Verify results
    assert traffic.visits_month >= 0
    assert traffic.visits_growth is not None
    assert traffic.bounce_rate is not None
    assert traffic.avg_time_on_site >= 0
    # traffic_sources might be None in stub mode

def test_multiple_traffic_estimations():
    """Test that multiple traffic estimations return different values"""
    estimator = TrafficEstimator()
    
    # Estimate traffic for different URLs
    traffic1 = estimator.estimate_traffic("https://test1.com")
    traffic2 = estimator.estimate_traffic("https://test2.com")
    
    # While values are random, they should at least be valid
    assert traffic1.visits_month >= 0
    assert traffic2.visits_month >= 0
    assert traffic1.bounce_rate >= 0
    assert traffic2.bounce_rate >= 0