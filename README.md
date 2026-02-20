# PolluxKart - E-Commerce Store

<div align="center">
  <img src="frontend/public/logo192.svg" alt="PolluxKart Logo" width="80" height="80">
  
  **Your one-stop destination for electronics, fashion, home essentials, and more.**
</div>

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB 7.0+
- Yarn

---

### 1. Start MongoDB

```bash
mongod
```

---

### 2. Run Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=polluxkart
JWT_SECRET=your-secret-key-here
EOF

# Seed database (optional - adds sample data)
python scripts/seed_db.py

# Start server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend will be running at: http://localhost:8001

API Docs: http://localhost:8001/docs

---

### 3. Run Frontend

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
yarn install

# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Start development server
yarn start
```

Frontend will be running at: http://localhost:3000

---

### Test Credentials

After running `seed_db.py`:

| Field | Value |
|-------|-------|
| Email | `test@polluxkart.com` |
| Password | `Test@123` |

---

## 📁 Project Structure

```
polluxkart-client/
├── backend/          # FastAPI backend
│   ├── routes/       # API endpoints
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   └── server.py     # Entry point
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/
│   │   ├── services/ # API services
│   │   └── context/  # State management
│   └── package.json
│
└── README.md
```

---

## 🔧 Troubleshooting

**MongoDB not running:**
```bash
# Check status
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /usr/local/var/mongodb
```

**Port already in use:**
```bash
# Kill process on port
lsof -ti:8001 | xargs kill -9   # Backend
lsof -ti:3000 | xargs kill -9   # Frontend
```

**Backend health check:**
```bash
curl http://localhost:8001/api/health
```

---

## 📄 License

MIT License
