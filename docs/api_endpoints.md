# API Endpoints

## Overview

The Marketplace Intelligence API provides programmatic access to product data, MRR estimates, and search functionality.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

No authentication is required for the MVP version.

## Endpoints

### Health Check

**GET** `/health`

Check the health status of the API and database.

**Response:**
```json
{
  "status": "healthy",
  "database": "healthy",
  "service": "marketplace-intelligence"
}
```

### List Products

**GET** `/products/`

Retrieve a paginated list of products with optional filtering.

**Query Parameters:**
- `skip` (integer, default: 0): Number of products to skip
- `limit` (integer, default: 50, max: 100): Number of products to return
- `category` (string, optional): Filter by category
- `tag` (string, optional): Filter by tag
- `min_mrr` (number, optional): Minimum MRR filter
- `max_mrr` (number, optional): Maximum MRR filter

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "canonical_url": "https://product.com",
      "description": "Product description",
      "logo_url": "https://product.com/logo.png",
      "categories": ["category1"],
      "tags": ["tag1", "tag2"],
      "created_at": "2023-01-01T00:00:00",
      "updated_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 50
}
```

### Get Product Details

**GET** `/products/{id}`

Retrieve detailed information for a specific product.

**Path Parameters:**
- `id` (integer): Product ID

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Product Name",
    "canonical_url": "https://product.com",
    "description": "Product description",
    "logo_url": "https://product.com/logo.png",
    "categories": ["category1"],
    "tags": ["tag1", "tag2"],
    "marketplaces": [
      {
        "name": "Product Hunt",
        "listing_url": "https://producthunt.com/posts/product",
        "upvotes": 150,
        "reviews_count": 25,
        "rating": 4.5,
        "price_plans": [
          {
            "name": "Basic",
            "price": 29.0,
            "currency": "USD",
            "period": "monthly",
            "features": ["Feature 1", "Feature 2"],
            "is_popular": false
          }
        ]
      }
    ],
    "estimates": {
      "mrr_low": 500.0,
      "mrr_likely": 1500.0,
      "mrr_high": 3000.0,
      "confidence": 0.75,
      "assumptions": ["Assumption 1", "Assumption 2"],
      "methodology": "Rule-based estimation using traffic data and pricing information"
    },
    "traffic": {
      "visits_month": 10000,
      "visits_growth": 5.2,
      "bounce_rate": 45.3,
      "avg_time_on_site": 120.5,
      "traffic_sources": "{\"direct\": 30, \"search\": 50, \"referral\": 20}"
    },
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### Search Products

**GET** `/products/search/`

Search products by name, description, tags, or categories.

**Query Parameters:**
- `q` (string, required): Search query
- `skip` (integer, default: 0): Number of products to skip
- `limit` (integer, default: 50, max: 100): Number of products to return

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "canonical_url": "https://product.com",
      "description": "Product description",
      "logo_url": "https://product.com/logo.png",
      "categories": ["category1"],
      "tags": ["tag1", "tag2"],
      "created_at": "2023-01-01T00:00:00",
      "updated_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 50
}
```

### Get Product Estimates

**GET** `/products/{id}/estimates`

Retrieve MRR estimates for a specific product.

**Path Parameters:**
- `id` (integer): Product ID

**Response:**
```json
{
  "mrr_low": 500.0,
  "mrr_likely": 1500.0,
  "mrr_high": 3000.0,
  "confidence": 0.75,
  "assumptions": ["Assumption 1", "Assumption 2"],
  "methodology": "Rule-based estimation using traffic data and pricing information"
}
```

## Error Responses

All endpoints may return the following error responses:

- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

**Error Response Format:**
```json
{
  "detail": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Maximum 100 requests per minute per IP address

## CORS

CORS is enabled for the following origins:
- `http://localhost:3000`
- `http://localhost:8000`