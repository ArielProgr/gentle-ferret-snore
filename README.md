# Marketplace Intelligence

A SaaS platform that tracks, normalizes, and presents data from multiple SaaS marketplaces.

## Project Structure

```
marketplace-intelligence/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── scrapers/
│   │   └── main.py
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── scripts/
│   └── scrape_producthunt.py
├── data/
│   └── raw/
├── docker-compose.yml
└── README.md
```

## Tech Stack

- **Backend**: Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Database**: PostgreSQL
- **Scraping**: requests + BeautifulSoup (with Playwright as fallback)
- **Storage**: Local filesystem for raw data snapshots
- **Testing**: pytest
- **Deployment**: Docker + docker-compose

## Getting Started

1. Clone the repository
2. Run `docker-compose up --build` to start all services
3. Access the application at `http://localhost:3000`
4. API documentation available at `http://localhost:8000/docs`

## Features

- Data ingestion from Product Hunt, G2, and AppSumo
- Data normalization and storage in PostgreSQL
- REST API with endpoints for products, search, and estimates
- Dashboard with product listings, details, and comparison
- MRR estimation model with configurable parameters
- Raw data snapshots for audit purposes