import random
from typing import List
from app.schemas.product import MrrEstimate, PricePlan, MarketplaceListing

class MrrEstimator:
    def __init__(self):
        pass
    
    def estimate_mrr(self, product: dict, marketplaces: List[MarketplaceListing], traffic: dict) -> MrrEstimate:
        """
        Estimate MRR for a product based on pricing, traffic, and market data.
        This is a simple rule-based model for the MVP.
        """
        # Get the highest price plan as a baseline
        highest_price = 0.0
        for marketplace in marketplaces:
            for plan in marketplace.price_plans:
                if plan.price > highest_price:
                    highest_price = plan.price
        
        # Get traffic data
        visits_month = traffic.get('visits_month', 0) if traffic else 0
        
        # Simple estimation model:
        # 1. Estimate conversion rate based on traffic (more traffic = lower conversion)
        # 2. Estimate customers based on conversion rate and traffic
        # 3. Calculate MRR based on price and customers
        
        # Conversion rate estimation (simplistic model)
        if visits_month > 100000:
            conversion_rate = 0.005  # 0.5% for high traffic sites
        elif visits_month > 10000:
            conversion_rate = 0.01   # 1% for medium traffic sites
        elif visits_month > 1000:
            conversion_rate = 0.02   # 2% for low traffic sites
        else:
            conversion_rate = 0.03   # 3% for very low traffic sites
        
        # Estimate number of customers
        estimated_customers = max(1, int(visits_month * conversion_rate))
        
        # Calculate MRR ranges based on different scenarios
        mrr_likely = highest_price * estimated_customers
        
        # Low scenario: 50% of likely
        mrr_low = mrr_likely * 0.5
        
        # High scenario: 150% of likely
        mrr_high = mrr_likely * 1.5
        
        # Confidence based on traffic volume (more traffic = higher confidence)
        confidence = min(1.0, visits_month / 100000.0)
        
        # Assumptions used in the model
        assumptions = [
            f"Conversion rate estimated at {conversion_rate*100:.2f}% based on {visits_month} monthly visits",
            f"Estimated {estimated_customers} customers based on traffic and conversion rate",
            f"Highest price plan of ${highest_price} used as baseline",
            "Assumes SaaS business model with monthly recurring revenue",
            "Does not account for churn, expansion revenue, or enterprise deals"
        ]
        
        return MrrEstimate(
            mrr_low=round(mrr_low, 2),
            mrr_likely=round(mrr_likely, 2),
            mrr_high=round(mrr_high, 2),
            confidence=round(confidence, 2),
            assumptions=assumptions,
            methodology="Rule-based estimation using traffic data and pricing information"
        )