#!/usr/bin/env python3
"""
Script to populate database with sample data for testing
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
    """Create sample products, marketplaces, and related data"""
    
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
        marketplaces.append(marketplace)
    
    db.commit()
    
    # Create sample products
    product_names = [
        "TaskFlow Pro", "DataViz Studio", "CloudSync", "SecureChat", "MarketInsight",
        "CodeCraft", "DesignHub", "AnalyticsPro", "TeamCollab", "DevOps Toolkit",
        "AI Assistant", "ProjectPilot", "FinanceTracker", "HR Connect", "EduPlatform",
        "HealthMonitor", "EcoSolutions", "RetailPro", "LogisticsMaster", "MediaStream"
    ]
    
    categories = [
        "Productivity", "Analytics", "Communication", "Security", "Development",
        "Design", "Marketing", "Finance", "HR", "Education"
    ]
    
    tags_pool = [
        "saas", "productivity", "analytics", "ai", "automation", "collaboration",
        "cloud", "security", "development", "design", "marketing", "finance"
    ]
    
    for i in range(50):  # Create 50 sample products
        name = f"{random.choice(product_names)} {random.randint(1, 100)}"
        category = random.choice(categories)
        tags = random.sample(tags_pool, random.randint(2, 5))
        
        # Create product
        product = Product(
            name=name,
            canonical_url=f"https://example.com/products/{name.lower().replace(' ', '-')}",
            description=f"A revolutionary {category.lower()} solution that helps teams work smarter.",
            categories=[category],
            tags=tags
        )
        db.add(product)
        db.flush()  # Get product ID without committing
        
        # Create marketplace listings<dyad-command type="rebuild"></dyad-command><dyad-chat-summary>Creating Marketplace Intelligence SaaS MVP</dyad-chat-summary><dyad-problem-report summary="14 problems">
<problem file="frontend/vite.config.ts" line="2" column="19" code="2307">Cannot find module '@vitejs/plugin-react' or its corresponding type declarations.</problem>
<problem file="frontend/src/main.tsx" line="3" column="17" code="2307">Cannot find module './App.tsx' or its corresponding type declarations.</problem>
<problem file="frontend/src/App.tsx" line="3" column="20" code="2307">Cannot find module './components/Navbar' or its corresponding type declarations.</problem>
<problem file="frontend/src/App.tsx" line="4" column="25" code="2307">Cannot find module './pages/ProductList' or its corresponding type declarations.</problem>
<problem file="frontend/src/App.tsx" line="5" column="27" code="2307">Cannot find module './pages/ProductDetail' or its corresponding type declarations.</problem>
<problem file="frontend/src/App.tsx" line="6" column="31" code="2307">Cannot find module './pages/ProductComparison' or its corresponding type declarations.</problem>
<problem file="frontend/src/components/Navbar.tsx" line="3" column="29" code="2305">Module '&quot;lucide-react&quot;' has no exported member 'Compare'.</problem>
<problem file="frontend/src/services/api.ts" line="1" column="19" code="2307">Cannot find module 'axios' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductList.tsx" line="4" column="53" code="2307">Cannot find module '@/services/api' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductList.tsx" line="5" column="25" code="2307">Cannot find module '@/types/product' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductDetail.tsx" line="4" column="32" code="2307">Cannot find module '@/services/api' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductDetail.tsx" line="5" column="25" code="2307">Cannot find module '@/types/product' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductComparison.tsx" line="4" column="32" code="2307">Cannot find module '@/services/api' or its corresponding type declarations.</problem>
<problem file="frontend/src/pages/ProductComparison.tsx" line="5" column="25" code="2307">Cannot find module '@/types/product' or its corresponding type declarations.</problem>
</dyad-problem-report>I'll fix these TypeScript compile-time errors. The main issues are missing dependencies and incorrect imports. Let me address them:

<dyad-add-dependency packages="axios recharts @vitejs/plugin-react"></dyad-add-dependency>

Now I'll fix the code files:

<dyad-write path="frontend/vite.config.ts" description="Fixing Vite config imports">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})