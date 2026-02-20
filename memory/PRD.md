# PolluxKart - E-Commerce Platform PRD

## Original Problem Statement
Build a complete e-commerce platform named "PolluxKart" with:
- Frontend: React with tech-savvy, organic, fresh design
- Backend: Microservice architecture with MongoDB
- Features: Products, Cart, Checkout, Orders, Payments, Reviews, Wishlist, Inventory
- Admin Panel: CRUD for Products, Categories, Promotions, Orders, Users

## Technical Architecture

### Frontend (React)
- **Stack**: React 19, Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM v7
- **Testing**: Jest, React Testing Library (28 tests)
- **CI/CD**: GitHub Actions
- **API Integration**: Fully connected to FastAPI backend

### Backend (FastAPI)
- **Stack**: FastAPI, Python 3.11, MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose) with role-based access (user/admin)
- **Payment**: Razorpay integration with Cash on Delivery option
- **Testing**: Pytest (47 tests)
- **File Uploads**: Local async file uploads for product images (aiofiles)

### Database (MongoDB)
Collections:
- `users` - User accounts with role field (user/admin)
- `products` - Product catalog with multiple images
- `categories` - Product categories
- `carts` - Shopping carts
- `wishlists` - User wishlists
- `orders` - Order records with shipping address
- `payments` - Payment transactions
- `inventory` - Stock management
- `reviews` - Product reviews
- `stock_movements` - Inventory audit trail
- `promotions` - Discount codes and promotions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (email/phone) - returns user with role

### Products
- `GET /api/products` - List products (pagination, filter, sort, search)
- `GET /api/products/{id}` - Get product
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `GET /api/products/{id}/reviews` - Get reviews
- `POST /api/products/{id}/reviews` - Add review (auth)

### Cart
- `GET /api/cart` - Get cart (auth)
- `POST /api/cart/items` - Add to cart (auth)
- `PUT /api/cart/items/{product_id}` - Update quantity (auth)
- `DELETE /api/cart/items/{product_id}` - Remove item (auth)

### Wishlist
- `GET /api/wishlist` - Get wishlist (auth)
- `GET /api/wishlist/products` - Get full product details (auth)
- `POST /api/wishlist/items` - Add item (auth)
- `DELETE /api/wishlist/items/{product_id}` - Remove item (auth)

### Orders
- `GET /api/orders` - Get orders (auth)
- `POST /api/orders` - Create order (auth)
- `GET /api/orders/{id}` - Get order (auth)
- `POST /api/orders/{id}/cancel` - Cancel order (auth)

### Payments
- `POST /api/payments/razorpay/create/{order_id}` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/razorpay/webhook` - Webhook handler

### Inventory
- `GET /api/inventory/{product_id}` - Get inventory
- `GET /api/inventory/{product_id}/available` - Get available stock
- `POST /api/inventory/adjust` - Adjust stock (admin)
- `GET /api/inventory/alerts/low-stock` - Low stock alerts (admin)

### Admin (require admin role)
- `GET /api/admin/dashboard` - Dashboard stats
- `POST /api/admin/upload` - Upload image
- `POST /api/admin/upload/multiple` - Upload multiple images
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category
- `GET /api/admin/promotions` - Get all promotions
- `POST /api/admin/promotions` - Create promotion
- `PUT /api/admin/promotions/{id}` - Update promotion
- `DELETE /api/admin/promotions/{id}` - Delete promotion
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Update user role

## Features Implemented

### Frontend (December 2025 - February 2026)
- [x] All pages: Home, Store, Product, Cart, Checkout, Orders, Wishlist, Auth
- [x] INR currency formatting (₹)
- [x] Country code selector for phone auth
- [x] OTP verification flow (MOCKED)
- [x] Categories dropdown in navbar
- [x] **Debounced search (500ms) - FIXED**
- [x] Out-of-stock handling
- [x] Toast notifications with close button
- [x] Unit tests (28 passing)
- [x] GitHub Actions CI/CD
- [x] **Frontend-Backend Integration - COMPLETED**
- [x] **Admin Panel UI - COMPLETED** (Dashboard, Products, Orders, Users, Categories, Promotions)
- [x] **Admin Route Protection - COMPLETED** (ProtectedRoute component)

### Backend (December 2025 - February 2026)
- [x] JWT Authentication with role-based access (user/admin)
- [x] Product CRUD with filtering, sorting, search
- [x] Shopping cart management
- [x] Wishlist sync
- [x] Order management with shipping address
- [x] Razorpay payment integration + Cash on Delivery
- [x] Inventory management with stock movements
- [x] Product reviews & ratings
- [x] Email notifications (templates ready)
- [x] Pytest tests (47 passing)
- [x] **Admin APIs - COMPLETED** (Dashboard, Products, Categories, Promotions, Orders, Users)
- [x] **Image Upload API - COMPLETED** (local async file uploads)

## Frontend-Backend Integration (December 2025)

### Services Created/Updated
- `apiConfig.js` - Base API configuration with auth token management
- `authService.js` - Login, register, logout with JWT
- `productService.js` - Products, categories, brands, reviews
- `cartService.js` - Cart operations (syncs with backend when authenticated)
- `wishlistService.js` - Wishlist operations (syncs with backend when authenticated)
- `orderService.js` - Order management

### Context Updates
- `AuthContext.js` - Real API login/signup, JWT token storage
- `CartContext.js` - Hybrid approach: localStorage fallback + backend sync
- `WishlistContext.js` - Hybrid approach: localStorage fallback + backend sync

### Key Features
- Products load from MongoDB via backend API
- Search with 500ms debounce (fixed recurring bug)
- Categories and brands dynamically loaded
- Cart syncs to backend when user is authenticated
- Wishlist syncs to backend when user is authenticated
- Guest users can still use cart/wishlist via localStorage

## Test Credentials
- **Email**: test@polluxkart.com
- **Phone**: +919876543210
- **Password**: Test@123

## Seed Data
- 6 Categories
- 21 Products (2 out of stock)
- 20 Brands
- 1 Test user

## Known Mocked Elements
- **OTP Verification**: Frontend mock - any 6-digit code works (123456 recommended)
- **Razorpay**: Mock order IDs generated when API keys not configured
- **Email Notifications**: SMTP not configured - logs to console

## Environment Variables Required

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=polluxkart
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxx  # Optional
RAZORPAY_KEY_SECRET=xxx  # Optional
SMTP_HOST=smtp.gmail.com  # Optional
SMTP_USER=xxx  # Optional
SMTP_PASSWORD=xxx  # Optional
```

## Test Results
- **Backend Tests**: 47/47 passing (100%)
- **Frontend Integration**: All features tested and working
- **Search Debounce**: Verified working with 500ms delay
- **Admin Auth Flow**: Verified - non-admin users redirected to /auth
- **Admin Products**: Verified - loads without 422 error (pageSize=50)

## Next Steps (Backlog)

### P0 - Critical
- [x] ~~Connect frontend to backend APIs~~ ✅ COMPLETED
- [x] ~~Add admin panel for product management~~ ✅ COMPLETED
- [x] ~~Admin route protection~~ ✅ COMPLETED
- [ ] Configure Razorpay live keys

### P1 - Important
- [ ] Wire up admin panel forms to backend APIs (Add/Edit Product, Categories, etc.)
- [ ] Implement Product Reviews UI (reviews API ready)
- [ ] Configure SMTP for email notifications
- [ ] Add real OTP service (Twilio/AWS SNS)
- [ ] Add order tracking with status updates
- [ ] Add user profile/settings page

### P2 - Nice to Have
- [ ] Cloud image storage (S3/Cloudinary migration)
- [ ] Add coupon/discount codes
- [ ] Add order invoice PDF generation
- [ ] Add social login (Google/Facebook)
- [ ] "Remember this device" for OTP
