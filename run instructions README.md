# Annuities Analysis Platform

Full-stack platform for annuity product analysis with React + FastAPI and Supabase PostgreSQL. **Database is configured and ready to run.**

---

## Quick Start (Run Now)

### 1. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

You should see: `Uvicorn running on http://127.0.0.1:8000`

### 2. Start the frontend

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:5173/`

### 3. Open the app

1. Go to **http://localhost:5173**
2. Click **Create one** to register
3. Sign in with your email and password
4. You’ll see the **Products** dashboard with sample annuity products

---

## Verify It’s Working

For full API testing, see **[docs/API_TESTING.md](docs/API_TESTING.md)** — cURL examples, request/response formats, and test script.

| Check | URL | Expected |
|-------|-----|----------|
| Backend health | http://localhost:8000 | `{"message": "Annuities Analysis API", "docs": "/docs"}` |
| API docs | http://localhost:8000/docs | Swagger UI |
| App | http://localhost:5173 | Login page |

### Test login (optional)

A demo user was created during database setup:

- **Email:** `demo@annuities.com`
- **Password:** `password123`

Use this if you don’t want to register, or register a new account.

---

## Configuration (Already Set)

The following are configured in `backend/.env`:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` |

The database was set up with:

- 8 tables: `annuity_products`, `income_riders`, `index_options`, `historical_performance`, `users`, `client_profiles`, `saved_comparisons`
- Sample products (Pacific Life, Athene, Allianz, etc.)
- Income riders, index options, and historical performance
- Demo user: `demo@annuities.com`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Could not connect to database` | Confirm backend `.env` has the correct `DATABASE_URL` |
| `ModuleNotFoundError: fastapi` | Run `pip install -r requirements.txt` in the backend |
| CORS errors | Ensure backend is running and `CORS_ORIGINS` includes `http://localhost:5173` |
| Empty products | Refresh the page; sample data should appear |

---

## Project Structure

```
├── backend/                 # FastAPI app
│   ├── app/
│   ├── .env                 # Database & secrets (configured)
│   └── requirements.txt
├── frontend/                # React + Vite
│   └── src/
├── dashboard_specs/         # 11 Excel schema files
└── data_specifications_01262026.xlsx - fa.csv
```
