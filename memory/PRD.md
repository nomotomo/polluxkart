# PolluxKart - E-Commerce Frontend Prototype PRD

## Original Problem Statement
Build a frontend prototype for an e-commerce store named "PolluxKart" with a tech-savvy, organic, and fresh design aesthetic.

## User Personas
- **Shoppers**: Users browsing products, adding to cart, and making purchases
- **Return Customers**: Users checking orders and reordering items

## Core Requirements

### Pages
- ✅ **Home Page**: Hero section, promotions, categories with modal
- ✅ **Store Page**: Product grid with filters, sorting, search, pagination
- ✅ **Product Detail Page**: Multiple images, reviews, add to cart, wishlist
- ✅ **Cart Page**: View items, update quantities, promo codes
- ✅ **Checkout Page**: Address and payment forms
- ✅ **Orders Page**: Order history with reorder functionality
- ✅ **Wishlist Page**: Saved items management
- ✅ **Auth Page**: Login/Signup with email and phone

### Features
- ✅ INR currency (₹) throughout the application
- ✅ Country code selector for phone authentication
- ✅ Categories dropdown in navigation bar
- ✅ Wishlist functionality (add/remove from product page)
- ✅ Out-of-stock products with disabled purchase buttons
- ✅ Toast notifications with close button
- ✅ Reorder button on Orders page
- ✅ Unit tests with GitHub Actions CI

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM v7
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions

## What's Been Implemented (January 2026)

### Core Application
- Complete React frontend with all pages
- Design system with teal/lime color palette
- Mock data with 20 products across 6 categories
- API service layer with fallback to mock data

### New Features (This Session)
1. **INR Currency**: formatPrice utility showing ₹ symbol with Indian number formatting
2. **Country Code Selector**: 20 countries with flags in Auth page
3. **Categories Navigation**: Full dropdown in header with subcategories
4. **Out-of-Stock Handling**: Disabled buttons and indicator on ProductPage
5. **Wishlist Integration**: Working add/remove on ProductPage
6. **Unit Tests**: 24 tests covering currency, products, country codes
7. **GitHub Actions CI**: Runs tests, lint, build on PR to main/dev

## File Structure
```
/app/frontend/
├── src/
│   ├── __tests__/           # Unit tests
│   ├── components/
│   │   ├── brand/Logo.jsx
│   │   ├── home/
│   │   ├── layout/Header.jsx, Footer.jsx
│   │   ├── products/ProductCard.jsx
│   │   └── ui/              # shadcn components
│   ├── context/             # Auth, Cart, Wishlist contexts
│   ├── data/                # products.js, countryCodes.js
│   ├── pages/               # All page components
│   ├── services/            # API configuration
│   └── utils/currency.js    # INR formatting
├── .github/workflows/ci.yml # GitHub Actions
└── README.md
```

## Testing Status
- ✅ Unit Tests: 24/24 passing
- ✅ Frontend E2E: All features tested and working
- ✅ Out-of-stock: Properly disables purchase buttons

## Known Mocked Elements
- **Backend API**: All API calls fallback to local mock data
- **Authentication**: Mocked - any credentials work
- **Payment**: UI only - no real transactions
- **Orders**: Stored in localStorage, not persistent

## P0/P1/P2 Features Status

### P0 (Critical) - COMPLETE
- [x] All main pages functional
- [x] INR currency display
- [x] Basic cart/checkout flow
- [x] Product browsing and filtering

### P1 (Important) - COMPLETE
- [x] Wishlist functionality
- [x] Country code selector
- [x] Categories in navbar
- [x] Out-of-stock handling
- [x] Unit testing setup

### P2 (Nice to Have) - PENDING
- [ ] Real backend integration
- [ ] Payment gateway integration
- [ ] User profile management
- [ ] Order tracking
- [ ] Email notifications

## Next Steps (Backlog)
1. Connect to real backend API when available
2. Implement actual payment processing (Stripe/Razorpay)
3. Add user profile/settings page
4. Real authentication (JWT/OAuth)
5. Order tracking with status updates
