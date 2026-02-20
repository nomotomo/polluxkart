# PolluxKart - E-Commerce Store

<div align="center">
  <img src="frontend/public/logo192.svg" alt="PolluxKart Logo" width="80" height="80">
  
  **Your one-stop destination for electronics, fashion, home essentials, and more.**
  
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
  ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi)
  ![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Running the Full Stack](#-running-the-full-stack)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Frontend
- 🏠 **Home Page** - Hero section, promotions, categories, featured products
- 🛒 **Store Page** - Product listing with filters, search (debounced), sort, pagination
- 📦 **Product Details** - Multiple images, reviews, ratings, related products
- 🛍️ **Shopping Cart** - Add/remove items, quantity controls, promo codes
- 💳 **Checkout** - Address selection, multiple payment methods (Razorpay, Card, UPI, COD)
- 📋 **Orders** - Order history with tracking timeline
- ❤️ **Wishlist** - Save products for later
- 🔐 **Authentication** - Login/Signup with email or phone
- 📱 **Responsive Design** - Mobile-first, works on all devices

### Backend
- 🔑 **JWT Authentication** - Secure token-based auth
- 📦 **Product Catalog** - CRUD with filtering, sorting, search
- 🛒 **Cart Management** - Persistent cart synced to user account
- ❤️ **Wishlist API** - Backend-synced wishlists
- 📋 **Order Management** - Create, track, cancel orders
- 💳 **Razorpay Integration** - Payment processing
- 📊 **Inventory Management** - Stock tracking with alerts
- ⭐ **Reviews & Ratings** - Product review system

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 19.0.0 | UI Framework |
| | React Router | 7.x | Client-side routing |
| | Tailwind CSS | 3.4 | Styling |
| | Shadcn/UI | Latest | Component library |
| **Backend** | FastAPI | 0.109 | API Framework |
| | Python | 3.11+ | Runtime |
| | Motor | 3.3 | Async MongoDB driver |
| | python-jose | Latest | JWT handling |
| **Database** | MongoDB | 7.0+ | Document database |
| **Payments** | Razorpay | Latest | Payment gateway |

---

## 📋 Prerequisites

| Software | Minimum Version | Download Link |
|----------|-----------------|---------------|
| **Node.js** | 18.0.0+ | [Download](https://nodejs.org/) |
| **Yarn** | 1.22.0+ | [Download](https://yarnpkg.com/) |
| **Python** | 3.11+ | [Download](https://python.org/) |
| **MongoDB** | 7.0+ | [Download](https://mongodb.com/try/download/community) |
| **Git** | Any recent | [Download](https://git-scm.com/) |

### Verify Installation

```bash
node --version      # v18.x.x or higher
yarn --version      # 1.22.x or higher
python --version    # 3.11.x or higher
mongod --version    # 7.x.x or higher
```

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/nomotomo/polluxkart-client.git
cd polluxkart-client

# 2. Start MongoDB (in a separate terminal)
mongod

# 3. Setup and start Backend (in a new terminal)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/seed_db.py  # Seed sample data
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# 4. Setup and start Frontend (in a new terminal)
cd frontend
yarn install
yarn start
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

**Test Credentials:**
- Email: `test@polluxkart.com`
- Password: `Test@123`

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=polluxkart

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Razorpay (optional - for payments)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 5: Start MongoDB

```bash
# Start MongoDB service
# On macOS (with Homebrew):
brew services start mongodb-community

# On Ubuntu/Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB

# Or run directly:
mongod --dbpath /path/to/data/db
```

### Step 6: Seed the Database (Optional)

```bash
# Populate database with sample data
python scripts/seed_db.py
```

This creates:
- 6 product categories
- 21 sample products
- 20 brands
- 1 test user (`test@polluxkart.com` / `Test@123`)

### Step 7: Run the Backend Server

```bash
# Development mode with hot-reload
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Production mode
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

### Verify Backend is Running

```bash
# Health check
curl http://localhost:8001/api/health

# Expected response:
# {"status":"healthy","service":"PolluxKart API","version":"1.0.0","database":"connected"}

# Get products
curl http://localhost:8001/api/products

# Login test
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@polluxkart.com","password":"Test@123"}'
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Step 4: Run the Frontend

```bash
# Development mode
yarn start
```

The app will open at http://localhost:3000

### Build for Production

```bash
# Create optimized build
yarn build

# Preview production build
yarn global add serve
serve -s build
```

---

## 🏃 Running the Full Stack

### Option 1: Manual (Separate Terminals)

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Frontend:**
```bash
cd frontend
yarn start
```

### Option 2: Using Scripts

Create a `start.sh` file in the root:

```bash
#!/bin/bash

# Start MongoDB in background
mongod &

# Start Backend
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &

# Start Frontend
cd ../frontend
yarn start
```

Run with: `chmod +x start.sh && ./start.sh`

---

## 📚 API Documentation

### Interactive API Docs

Once the backend is running, access:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

### Key Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (email or phone) |
| GET | `/api/auth/me` | Get current user (auth required) |

#### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/{id}` | Get single product |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products/brands` | Get all brands |

#### Cart (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/{product_id}` | Update item quantity |
| DELETE | `/api/cart/items/{product_id}` | Remove item |

#### Orders (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/{id}/cancel` | Cancel order |

### Example API Calls

```bash
# Register a new user
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "SecurePass123"
  }'

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@polluxkart.com","password":"Test@123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# Get products with filters
curl "http://localhost:8001/api/products?search=tea&sort_by=price_asc&page=1"

# Add to cart (with auth)
curl -X POST http://localhost:8001/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_id":"product-uuid-here","quantity":2}'
```

---

## 📁 Project Structure

```
polluxkart-client/
├── backend/
│   ├── config/
│   │   ├── settings.py          # App configuration
│   │   └── database.py          # MongoDB connection
│   ├── models/
│   │   ├── user.py              # User model
│   │   ├── product.py           # Product model
│   │   ├── cart.py              # Cart model
│   │   ├── order.py             # Order model
│   │   └── ...
│   ├── routes/
│   │   ├── auth.py              # Auth endpoints
│   │   ├── products.py          # Product endpoints
│   │   ├── cart.py              # Cart endpoints
│   │   ├── orders.py            # Order endpoints
│   │   └── ...
│   ├── services/
│   │   ├── auth_service.py      # Auth business logic
│   │   ├── product_service.py   # Product business logic
│   │   └── ...
│   ├── utils/
│   │   ├── auth.py              # JWT utilities
│   │   └── email.py             # Email utilities
│   ├── scripts/
│   │   └── seed_db.py           # Database seeder
│   ├── server.py                # FastAPI app entry
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── layout/          # Header, Footer
│   │   │   └── products/        # Product components
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Auth state
│   │   │   ├── CartContext.js   # Cart state
│   │   │   └── WishlistContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── StorePage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── apiConfig.js     # API configuration
│   │   │   ├── authService.js   # Auth API calls
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── App.js
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── .env
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI
│
├── memory/
│   └── PRD.md                   # Product Requirements
│
└── README.md                    # This file
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URL` | Yes | - | MongoDB connection string |
| `DB_NAME` | Yes | - | Database name |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `JWT_ALGORITHM` | No | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | 1440 | Token expiry (minutes) |
| `RAZORPAY_KEY_ID` | No | - | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | No | - | Razorpay secret |
| `SMTP_HOST` | No | - | Email SMTP host |
| `SMTP_USER` | No | - | Email username |
| `SMTP_PASSWORD` | No | - | Email password |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_BACKEND_URL` | Yes | - | Backend API URL |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
yarn test
```

### Test Coverage

```bash
# Backend
pytest tests/ --cov=. --cov-report=html

# Frontend
yarn test --coverage
```

---

## 🔧 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongod --version
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /usr/local/var/mongodb
```

### Backend Won't Start

```bash
# Check Python version
python --version  # Must be 3.11+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check logs
uvicorn server:app --log-level debug
```

### Frontend API Errors

```bash
# Verify backend is running
curl http://localhost:8001/api/health

# Check CORS settings in backend
# Ensure frontend URL is allowed

# Check .env file
cat frontend/.env
# Should have: REACT_APP_BACKEND_URL=http://localhost:8001
```

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti:8001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ for <strong>PolluxKart</strong></p>
  <p>
    <a href="http://localhost:3000">Frontend</a> •
    <a href="http://localhost:8001/docs">API Docs</a>
  </p>
</div>
