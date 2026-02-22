# Admin Routes
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from typing import Optional, List
from models.admin import (
    DashboardStats, PromotionCreate, PromotionResponse, PromotionUpdate,
    ProductCreate, ProductUpdate, CategoryCreate, CategoryUpdate,
    ImageUploadResponse, UserRole
)
from models.order import OrderStatus
from services.admin_service import AdminService
from utils.auth import get_current_user
import os
import uuid
import aiofiles
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])
admin_service = AdminService()

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Middleware to check admin role
async def require_admin(current_user: dict = Depends(get_current_user)):
    """Require admin role for access"""
    user_role = current_user.get("role", "user")
    if user_role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Dashboard
@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard(current_user: dict = Depends(require_admin)):
    """Get dashboard statistics"""
    return await admin_service.get_dashboard_stats()

# Image Upload
@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_admin)
):
    """Upload an image file"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 5MB)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 5MB limit"
        )
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)
    
    # Return URL (relative path that will be served)
    return ImageUploadResponse(
        url=f"/api/uploads/{filename}",
        filename=filename,
        size=len(content),
        content_type=file.content_type
    )

@router.post("/upload/multiple", response_model=List[ImageUploadResponse])
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(require_admin)
):
    """Upload multiple image files"""
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed per upload"
        )
    
    results = []
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    
    for file in files:
        if file.content_type not in allowed_types:
            continue
        
        content = await file.read()
        if len(content) > 5 * 1024 * 1024:
            continue
        
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        async with aiofiles.open(filepath, "wb") as f:
            await f.write(content)
        
        results.append(ImageUploadResponse(
            url=f"/api/uploads/{filename}",
            filename=filename,
            size=len(content),
            content_type=file.content_type
        ))
    
    return results

# Products
@router.post("/products", status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(require_admin)
):
    """Create a new product"""
    return await admin_service.create_product(product_data)

@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current_user: dict = Depends(require_admin)
):
    """Update a product"""
    product = await admin_service.update_product(product_id, update_data)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(require_admin)
):
    """Delete a product"""
    success = await admin_service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Categories
@router.get("/categories")
async def get_all_categories(current_user: dict = Depends(require_admin)):
    """Get all categories with product counts"""
    return await admin_service.get_all_categories()

@router.post("/categories", status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: dict = Depends(require_admin)
):
    """Create a new category"""
    return await admin_service.create_category(category_data)

@router.put("/categories/{category_id}")
async def update_category(
    category_id: str,
    update_data: CategoryUpdate,
    current_user: dict = Depends(require_admin)
):
    """Update a category"""
    category = await admin_service.update_category(category_id, update_data)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    current_user: dict = Depends(require_admin)
):
    """Delete a category"""
    try:
        success = await admin_service.delete_category(category_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# Promotions
@router.get("/promotions")
async def get_all_promotions(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    """Get all promotions"""
    return await admin_service.get_all_promotions(status)

@router.post("/promotions", status_code=status.HTTP_201_CREATED)
async def create_promotion(
    promo_data: PromotionCreate,
    current_user: dict = Depends(require_admin)
):
    """Create a new promotion"""
    try:
        return await admin_service.create_promotion(promo_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/promotions/{promo_id}")
async def update_promotion(
    promo_id: str,
    update_data: PromotionUpdate,
    current_user: dict = Depends(require_admin)
):
    """Update a promotion"""
    promotion = await admin_service.update_promotion(promo_id, update_data)
    if not promotion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found")
    return promotion

@router.delete("/promotions/{promo_id}")
async def delete_promotion(
    promo_id: str,
    current_user: dict = Depends(require_admin)
):
    """Delete a promotion"""
    success = await admin_service.delete_promotion(promo_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found")
    return {"message": "Promotion deleted successfully"}

@router.post("/promotions/validate")
async def validate_promotion(
    code: str,
    order_total: float,
    current_user: dict = Depends(get_current_user)
):
    """Validate a promotion code"""
    try:
        return await admin_service.validate_promotion(code, order_total, current_user["user_id"])
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# Orders (Admin)
@router.get("/orders")
async def get_all_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    """Get all orders with pagination"""
    return await admin_service.get_all_orders(page, page_size, status, search)

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    tracking_number: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    """Update order status"""
    # Validate status
    valid_statuses = [s.value for s in OrderStatus]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Valid: {', '.join(valid_statuses)}"
        )
    
    order = await admin_service.update_order_status(order_id, status, tracking_number)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

# Users (Admin)
@router.get("/users")
async def get_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    """Get all users with pagination"""
    return await admin_service.get_all_users(page, page_size, search)

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    current_user: dict = Depends(require_admin)
):
    """Update user role"""
    valid_roles = [r.value for r in UserRole]
    if role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Valid: {', '.join(valid_roles)}"
        )
    
    user = await admin_service.update_user_role(user_id, role)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# Database Cleanup (for removing seed data)
@router.delete("/cleanup/seed-data")
async def cleanup_seed_data(
    confirm: str = Query(..., description="Must be 'CONFIRM' to proceed"),
    current_user: dict = Depends(require_admin)
):
    """
    Delete all seed/test data from the database.
    This removes products, categories, orders, etc. but preserves users.
    Use this ONLY ONCE after deployment to clean up development data.
    """
    if confirm != "CONFIRM":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must pass confirm=CONFIRM to proceed with cleanup"
        )
    
    db = admin_service.db
    
    collections_to_clean = [
        "products", "categories", "inventory", "reviews",
        "carts", "wishlists", "orders", "payments", 
        "stock_movements", "promotions"
    ]
    
    results = {}
    for collection in collections_to_clean:
        result = await db[collection].delete_many({})
        results[collection] = result.deleted_count
    
    return {
        "message": "Seed data cleanup complete",
        "deleted": results,
        "preserved": ["users"]
    }

