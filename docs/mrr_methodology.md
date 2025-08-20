# MRR Estimation Methodology

## Overview

The Marketplace Intelligence platform uses a rule-based model to estimate Monthly Recurring Revenue (MRR) for SaaS products. This approach provides reasonable estimates based on publicly available data while acknowledging the inherent limitations of such estimations.

## Model Components

### 1. Pricing Data
- Extracts the highest available price plan from marketplace listings
- Normalizes prices to USD when possible
- Considers only recurring pricing models (ignores one-time purchases)

### 2. Traffic Estimation
- Uses SimilarWeb API integration (stubbed in MVP)
- Estimates monthly visits to the product's website
- Calculates month-over-month growth rates

### 3. Conversion Rate Estimation
The model applies different conversion rates based on traffic volume:
- High traffic sites (>100K visits/month): 0.5% conversion rate
- Medium traffic sites (10K-100K visits/month): 1% conversion rate
- Low traffic sites (1K-10K visits/month): 2% conversion rate
- Very low traffic sites (<1K visits/month): 3% conversion rate

### 4. Customer Calculation
```
Estimated Customers = Monthly Visits × Conversion Rate
```

### 5. MRR Calculation
```
MRR Likely = Highest Price Plan × Estimated Customers
MRR Low = MRR Likely × 0.5
MRR High = MRR Likely × 1.5
```

## Confidence Scoring

The confidence score is calculated based on traffic volume:
```
Confidence = MIN(1.0, Monthly Visits / 100,000)
```

Higher traffic generally correlates with more reliable data sources.

## Assumptions

1. **SaaS Business Model**: Assumes all products follow a SaaS model with recurring revenue
2. **Public Pricing**: Assumes pricing information is publicly available and accurate
3. **Representative Traffic**: Assumes website traffic is representative of the product's user base
4. **Standard Conversion**: Uses industry-standard conversion rate estimates based on traffic volume
5. **No Churn Consideration**: Does not account for customer churn in this simplified model
6. **No Expansion Revenue**: Does not account for expansion revenue from existing customers
7. **No Enterprise Deals**: Does not account for large enterprise contracts that may skew averages

## Limitations

1. **Data Quality**: Estimates are only as good as the input data from marketplaces
2. **Marketplace Variance**: Different marketplaces may have different data quality and completeness
3. **Seasonal Fluctuations**: Does not account for seasonal variations in traffic or sales
4. **Geographic Differences**: Does not adjust for geographic market differences
5. **Product Maturity**: Does not distinguish between new and established products

## Future Improvements

1. Integration with real SimilarWeb/BuiltWith/Crunchbase APIs
2. Machine learning models for more accurate conversion rate predictions
3. Churn rate estimation
4. Expansion revenue modeling
5. Enterprise deal detection
6. Seasonal adjustment factors
7. Geographic market weighting