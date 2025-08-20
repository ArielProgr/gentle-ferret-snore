import random
from typing import Optional
from app.core.config import settings
from app.schemas.product import TrafficInfo

class TrafficEstimator:
    def __init__(self):
        self.stub_mode = settings.SIMILARWEB_STUB_MODE
    
    def estimate_traffic(self, product_url: str) -> TrafficInfo:
        """
        Estimate traffic for a product.
        In stub mode, returns random but realistic values.
        """
        if self.stub_mode:
            return self._generate_stub_traffic()
        else:
            # In real implementation, this would call SimilarWeb API
            # For now, we'll return stub data even when stub mode is off
            # to avoid requiring an API key
            return self._generate_stub_traffic()
    
    def _generate_stub_traffic(self) -> TrafficInfo:
        """Generate realistic stub traffic data"""
        return TrafficInfo(
            visits_month=random.randint(1000, 1000000),
            visits_growth=round(random.uniform(-20.0, 50.0), 2),
            bounce_rate=round(random.uniform(20.0, 80.0), 2),
            avg_time_on_site=round(random.uniform(30.0, 300.0), 2),
            traffic_sources='{"direct": 30, "search": 50, "referral": 20}'
        )