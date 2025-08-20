# MRR Estimation Methodology

## Overview

The Marketplace Intelligence platform uses a rule-based model to estimate Monthly Recurring Revenue (MRR) for SaaS products based on their pricing information and estimated traffic data.

## Estimation Process

### 1. Pricing Analysis

The system analyzes all available price plans for a product across different marketplaces and selects the highest price point as the baseline for estimation.

### 2. Traffic-Based Conversion Estimation

The model estimates conversion rates based on monthly website traffic:

- **High Traffic (>100,000 visits/month)**: 0.5% conversion rate
- **Medium Traffic (10,000-100,000 visits/month)**: 1% conversion rate
- **Low Traffic (1,000-10,000 visits/month)**: 2% conversion rate
- **Very Low Traffic (<1,000 visits/month)**: 3% conversion rate

This approach assumes that higher traffic sites have more casual visitors, resulting in lower conversion rates.

### 3. Customer Count Calculation

Estimated Customers = Monthly Visits × Conversion Rate

### 4. MRR Calculation

MRR = Highest Price Plan × Estimated Customers

### 5. Confidence Scoring

Confidence is calculated based on traffic volume:
Confidence = min(1.0, Monthly Visits / 100,000)

## Output Ranges

The system provides three estimates:

- **Low Estimate**: 50% of likely estimate
- **Likely Estimate**: Base calculation
- **High Estimate**: 150% of likely estimate

## Key Assumptions

1. All customers pay for the highest available price plan
2. The business model is SaaS with monthly recurring revenue
3. No account is taken for churn, expansion revenue, or enterprise deals
4. Conversion rates are estimated based on traffic volume alone
5. Traffic data is representative of potential customers

## Limitations

- Does not account for seasonal variations
- Does not consider market saturation or competition
- Assumes consistent pricing across all marketplaces
- Does not factor in customer lifetime value or churn rate
- Estimates are directional rather than precise

## Future Improvements

1. Integration with real traffic data sources (SimilarWeb, etc.)
2. Machine learning models for more accurate conversion rate predictions
3. Incorporation of market-specific factors
4. Addition of churn rate modeling
5. Enterprise deal modeling for high-value products