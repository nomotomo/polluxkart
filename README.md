# PolluxKart - E-Commerce Store

<div align="center">
  <img src="frontend/public/logo192.svg" alt="PolluxKart Logo" width="80" height="80">
  
  **Your one-stop destination for electronics, fashion, home essentials, and more.**
  
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the App](#-running-the-app)
- [Building for Production](#-building-for-production)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Environment Configuration](#-environment-configuration)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- 🏠 **Home Page** - Hero section, promotions, categories, featured products
- 🛒 **Store Page** - Product listing with filters, search, sort, pagination
- 📦 **Product Details** - Multiple images, reviews, ratings, related products
- 🛍️ **Shopping Cart** - Add/remove items, quantity controls, promo codes
- 💳 **Checkout** - Address selection, multiple payment methods (Razorpay, Card, UPI, COD)
- 📋 **Orders** - Order history with tracking timeline
- 🔐 **Authentication** - Login/Signup with form validation
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎨 **Modern UI** - Fresh teal/cyan theme with smooth animations

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | Frontend framework |
| React Router | 7.x | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Shadcn/UI | Latest | Component library |
| Lucide React | Latest | Icon library |
| Sonner | Latest | Toast notifications |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

| Software | Minimum Version | Download Link |
|----------|-----------------|---------------|
| **Node.js** | 18.0.0 or higher | [Download Node.js](https://nodejs.org/) |
| **Yarn** | 1.22.0 or higher | [Download Yarn](https://yarnpkg.com/) |
| **Git** | Any recent version | [Download Git](https://git-scm.com/) |

### Verify Installation

Open your terminal and run these commands to verify:

```bash
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check Yarn version
yarn --version
# Expected output: 1.22.x or higher

# Check Git version
git --version
# Expected output: git version 2.x.x
```

### Optional (for API Integration)

If you want to connect to the backend API:
- .NET 8.0 SDK (for running the backend)
- Your backend server running at `http://localhost:8010`

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/polluxkart-client.git

# Navigate to the project directory
cd polluxkart-client
```

### Step 2: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 3: Install Dependencies

```bash
# Install all dependencies using Yarn
yarn install
```

This will install all required packages defined in `package.json`.

### Step 4: Verify Installation

After installation completes, you should see a `node_modules` folder and a `yarn.lock` file.

```bash
# List installed packages (optional)
yarn list --depth=0
```

---

## 🚀 Running the App

### Development Mode

Start the development server with hot-reload:

```bash
# Make sure you're in the frontend directory
cd frontend

# Start the development server
yarn start
```

The app will automatically open in your default browser at:
- **Local:** http://localhost:3000
- **Network:** http://YOUR_IP:3000

### What You'll See

1. The terminal will show compilation progress
2. Once compiled, the browser will open automatically
3. Any code changes will hot-reload instantly

### Development Server Commands

```bash
# Start development server
yarn start

# Start with a specific port
PORT=3001 yarn start

# Start and open in a specific browser
BROWSER=firefox yarn start
```

---

## 🏗️ Building for Production

### Step 1: Create Production Build

```bash
# Make sure you're in the frontend directory
cd frontend

# Create optimized production build
yarn build
```

This creates a `build` folder with optimized, minified files.

### Step 2: Preview Production Build

```bash
# Install serve globally (one-time)
yarn global add serve

# Serve the production build
serve -s build
```

The production build will be available at http://localhost:3000

### Step 3: Deploy

The `build` folder contains static files ready for deployment to:
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- **GitHub Pages**
- **Any static hosting service**

### Build Output

```
build/
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   └── js/
│       └── main.[hash].js
├── index.html
├── favicon.svg
├── logo192.svg
└── manifest.json
```

---

## 📁 Project Structure

```
polluxkart-client/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg          # Browser tab icon
│   │   ├── logo192.svg          # App logo
│   │   ├── index.html           # HTML template
│   │   └── manifest.json        # PWA manifest
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── brand/
│   │   │   │   └── Logo.jsx     # Logo component
│   │   │   ├── home/
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── CategoriesModal.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   └── PromotionBanner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── products/
│   │   │   │   └── ProductCard.jsx
│   │   │   └── ui/              # Shadcn UI components
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       └── ... (40+ components)
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   └── CartContext.js   # Shopping cart state
│   │   │
│   │   ├── data/
│   │   │   └── products.js      # Mock product data
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── StorePage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── apiConfig.js     # API URL configuration
│   │   │   ├── productService.js # Product API calls
│   │   │   ├── basketService.js  # Cart API calls
│   │   │   └── API_INTEGRATION.md
│   │   │
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Design system tokens
│   │
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── package.json             # Dependencies
│   └── README.md                # Frontend documentation
│
└── README.md                    # This file
```

---

## 🔌 API Integration

### Default Mode (Mock Data)

By default, the app uses mock data stored in `/src/data/products.js`. This allows you to run and test the UI without a backend.

### Connecting to Backend API

#### Step 1: Configure API URL

Edit `/src/services/apiConfig.js`:

```javascript
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8010/';  // Your local backend URL
  }
  // ... other environments
};
```

#### Step 2: Enable API Mode

In `/src/pages/StorePage.jsx`, ensure:

```javascript
const USE_API = true;  // Set to true to use backend
```

#### Step 3: Start Your Backend

```bash
# Start your .NET backend (in a separate terminal)
cd your-backend-directory
dotnet run
```

#### Step 4: Verify Connection

1. Open browser DevTools (F12) → Network tab
2. Refresh the Store page
3. You should see API calls to `/Catalog/GetAllProducts`

### API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/Catalog/GetAllProducts` | GET | Get products with pagination/filters |
| `/Catalog/GetAllBrands` | GET | Get all brands |
| `/Catalog/GetAllTypes` | GET | Get all categories |
| `/Catalog/{id}` | GET | Get single product |
| `/Basket/{userName}` | GET | Get user's cart |
| `/Basket` | POST | Update cart |

### Fallback Behavior

If the API is unavailable, the app automatically falls back to mock data and shows an alert message.

---

## ⚙️ Environment Configuration

### Development Environment

Create a `.env.local` file in the `frontend` directory (optional):

```env
# Frontend URL (default: http://localhost:3000)
PORT=3000

# Backend API URL (if different from default)
REACT_APP_API_URL=http://localhost:8010
```

### Production Environment

For production deployment, set these environment variables:

```env
REACT_APP_API_URL=https://api.polluxkart.com
```

### Available Scripts

```bash
# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test

# Eject from Create React App (not recommended)
yarn eject

# Lint code
yarn lint

# Format code
yarn format
```

---

## 🎨 Customization

### Changing Brand Colors

Edit `/src/index.css`:

```css
:root {
  /* Primary color - change these values */
  --primary: 174 72% 45%;        /* Teal */
  --primary-glow: 174 72% 55%;
  --primary-dark: 174 72% 35%;
  
  /* Accent color */
  --accent: 90 60% 50%;          /* Lime green */
}
```

### Changing Logo

Replace files in `/public/`:
- `favicon.svg` - Browser tab icon (32x32)
- `logo192.svg` - App icon (192x192)

Or edit the Logo component at `/src/components/brand/Logo.jsx`.

### Adding New Pages

1. Create page component in `/src/pages/NewPage.jsx`
2. Add route in `/src/App.js`:

```jsx
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in Header if needed

---

## 🔧 Troubleshooting

### Common Issues

#### 1. `yarn install` fails

```bash
# Clear cache and retry
yarn cache clean
rm -rf node_modules
yarn install
```

#### 2. Port 3000 already in use

```bash
# Use a different port
PORT=3001 yarn start

# Or kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 3. CORS errors with API

Add your frontend URL to backend CORS policy:

```csharp
// In your .NET backend Startup.cs or Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

#### 4. Build fails with memory error

```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 yarn build
```

#### 5. Styles not loading

```bash
# Rebuild Tailwind CSS
yarn build:css
```

### Getting Help

- Check browser console for errors (F12 → Console)
- Check terminal for compilation errors
- Ensure all dependencies are installed
- Verify Node.js version is 18+

---

## 📝 Available Promo Codes (For Testing)

| Code | Discount |
|------|----------|
| `SUMMER50` | 50% off |
| `NEW15` | 15% off |
| `FREESHIP` | Free shipping |

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Unsplash](https://unsplash.com/) - Product images

---

<div align="center">
  <p>Built with ❤️ for <strong>PolluxKart</strong></p>
  <p>
    <a href="http://localhost:3000">Local Demo</a> •
    <a href="https://polluxkart.com">Production</a>
  </p>
</div>
