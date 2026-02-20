# PolluxKart - E-Commerce Platform PRD

## Original Problem Statement
Build a complete e-commerce platform named "PolluxKart" with:
- Frontend: React with tech-savvy, organic, fresh design
- Backend: Microservice architecture with MongoDB
- Features: Products, Cart, Checkout, Orders, Payments, Reviews, Wishlist, Inventory

## Technical Architecture

### Frontend (React)
- **Stack**: React 19, Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM v7
- **Testing**: Jest, React Testing Library (28 tests)
- **CI/CD**: GitHub Actions

### Backend (FastAPI)
- **Stack**: FastAPI, Python 3.11, MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Payment**: Razorpay integration
- **Testing**: Pytest (40 tests)

### Database (MongoDB)
Collections:
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `carts` - Shopping carts
- `wishlists` - User wishlists
- `orders` - Order records
- `payments` - Payment transactions
- `inventory` - Stock management
- `reviews` - Product reviews
- `stock_movements` - Inventory audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (email/phone)

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

## Features Implemented

### Frontend (January 2026)
- [x] All pages: Home, Store, Product, Cart, Checkout, Orders, Wishlist, Auth
- [x] INR currency formatting (₹)
- [x] Country code selector for phone auth
- [x] OTP verification flow (MOCKED)
- [x] Categories dropdown in navbar
- [x] Debounced search (500ms)
- [x] Out-of-stock handling
- [x] Toast notifications with close button
- [x] Unit tests (28 passing)
- [x] GitHub Actions CI/CD

### Backend (January 2026)
- [x] JWT Authentication
- [x] Product CRUD with filtering, sorting, search
- [x] Shopping cart management
- [x] Wishlist sync
- [x] Order management
- [x] Razorpay payment integration
- [x] Inventory management with stock movements
- [x] Product reviews & ratings
- [x] Email notifications (templates ready)
- [x] Pytest tests (40 passing)

## Test Credentials
- **Email**: test@polluxkart.com
- **Phone**: +919876543210
- **Password**: Test@123

## Seed Data
- 6 Categories
- 21 Products (2 out of stock)
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

## Next Steps (Backlog)

### P0 - Critical
- [ ] Connect frontend to backend APIs
- [ ] Configure Razorpay live keys
- [ ] Add admin panel for product management

### P1 - Important
- [ ] Configure SMTP for email notifications
- [ ] Add real OTP service (Twilio/AWS SNS)
- [ ] Add order tracking with status updates
- [ ] Add user profile/settings page

### P2 - Nice to Have
- [ ] Add product image upload
- [ ] Add coupon/discount codes
- [ ] Add order invoice PDF generation
- [ ] Add social login (Google/Facebook)
