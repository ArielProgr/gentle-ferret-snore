from fastapi import APIRouter
from .endpoints import products, health

router = APIRouter()
router.include_router(products.router, prefix="/products", tags=["products"])
router.include_router(health.router, prefix="/health", tags=["health"])