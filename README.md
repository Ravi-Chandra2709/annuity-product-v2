# Annuities Analysis Platform — Process Document

## 1. Approach & Data Analysis

The starting point was a data specification CSV (`data_specifications_01262026.xlsx - fa.csv`) — 244 column-level records across 11 Beacon Fixed Annuity tables. I used a Jupyter notebook (EDA.ipynb) to load the spec, group by `FILE_NAME`, inspect data types and cardinality, and map columns to SQL. The notebook split the spec into 11 Excel files (one per table) with Schema and Pivoted views, plus a sanity check to ensure no rows were lost. The spec describes Beacon tables (age, bonuses, companies, rates, waivers); the app uses a separate schema (`annuity_products`, `income_riders`, etc.) for the live product, so both coexist — Beacon for reference, app schema for the UI and APIs.

## 2. Schema & Architecture Decisions

| Decision | Why |
|----------|-----|
| **Supabase (PostgreSQL)** | Hosted DB with SSL and connection pooling; low setup for a 2‑hour build. For Railway, I used the pooler (port 6543) because direct connections use IPv6, which Railway doesn’t support. |
| **FastAPI + SQLAlchemy** | FastAPI for auto OpenAPI docs, typing, and async; SQLAlchemy for ORM and future migrations. |
| **React + Vite + TanStack Query** | I hadn't used Vite before; I chose it for speed — native ESM, instant HMR, fast builds. TanStack Query handles caching, refetch, and loading/error states with little config. |
| **JWT for auth** | Stateless, works with SPAs and proxies. Token in `localStorage`, sent via `Authorization` header. |
| **Products public, calculators/clients protected** | Products are browsable without login; calculators and client features require auth. |

## 3. How AI Was Used & What Worked

- **Claude for architecture** — Used as a design and implementation guide: folder layout, FastAPI routers, React component structure, and API shapes were iterated with Claude from the requirements.
- **EDA notebook** — AI helped draft the notebook to load the spec CSV, map columns to SQL types, and generate the split Excel files. That kept the data exploration structured and reproducible.
- **Railway & Vercel** — Deployment and fixes (CORS, Supabase pooler, bcrypt compatibility) were worked through with AI. Railway runs the FastAPI backend and connects to Supabase via the pooler; Vercel serves the React app and uses `VITE_API_URL` to call the backend.

**What worked:** Defining schemas and types first, incremental testing (sanity checks, API calls), and treating Beacon specs and app schema as separate concerns.

## 4. What I’d Do Next With More Time

1. **Calculator logic** — Implement real income and growth calculations: income base with deferral bonus, payout by age/type, rider fees, growth from caps and participation.
2. **Product comparison** — Full side‑by‑side view, save, and export.
3. **Client CRUD** — Add/edit/delete client profiles, link to comparisons.
4. **PDF illustrations** — Generate client-ready PDFs (e.g. jsPDF / react-pdf).
5. **Testing** — Unit tests for calculators, integration tests for APIs, basic E2E for login and product list.
6. **Beacon integration** — Map Beacon tables into the app schema or expose them as separate APIs.
7. **Security** — Row-level security in Supabase, rate limiting, CSRF where relevant.


## Submit / Demo

1. **Deployed app:** [https://annuity-product-v2.vercel.app](https://annuity-product-v2.vercel.app) — register, log in, browse products, view details.  
2. **Process document:** See [PROCESS_DOCUMENT.md](PROCESS_DOCUMENT.md) — approach, architecture, AI usage, next steps.

**API docs:** [https://annuity-product-v2-production.up.railway.app/docs](https://annuity-product-v2-production.up.railway.app/docs)

---

## What it does

Advisors can:

1. **Sign up / log in** with email and password
2. **Browse annuity products** with filters (carrier, state, rate, fees, etc.)
3. **View product details** — riders, index options, historical performance
4. **Use income and growth calculators** (Phase 2 — UI only; backend returns stub results)
5. **Compare products** (Phase 2 — placeholder page)
6. **Manage clients** (Phase 3 — placeholder with empty list)

Product data, riders, index options, and performance numbers are **randomly populated** for demo purposes and do not reflect real annuity products or rates.

---

## How it works

### Stack

| Layer | Tech | Role |
|-------|------|------|
| Frontend | React + Vite + TypeScript | SPA with routing, auth, API calls |
| API | FastAPI | REST backend, JWT auth, Swagger docs |
| DB | Supabase (PostgreSQL) | Hosted Postgres with pooling |
| Hosting | Vercel (frontend) + Railway (backend) | Deployment |

- **Frontend (Vercel):** Serves the React app; all API requests go to the Railway backend via `VITE_API_URL`.
- **Backend (Railway):** Runs FastAPI, connects to Supabase via the connection pooler (port 6543), handles auth with JWT.
- **Auth:** JWT stored in `localStorage`, sent as `Authorization: Bearer <token>`.

---

## APIs

### Authentication (all working)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | No | Create account (email, password, full name, company, role) |
| `/api/auth/login` | POST | No | Get JWT token (form: `username`, `password`) |
| `/api/auth/me` | GET | Bearer | Current user profile |
| `/api/auth/refresh` | POST | Bearer | New token |

### Products (all working)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/products` | GET | No | List products with filters (product_type, carrier_rating, state, min_rate, max_fee, surrender_period, min/max_investment, page, limit) |
| `/api/products/{id}` | GET | No | Single product |
| `/api/products/{id}/riders` | GET | No | Income riders (fees, payout %, bonus) |
| `/api/products/{id}/index-options` | GET | No | Index options (cap, participation, floor) |
| `/api/products/{id}/historical-performance` | GET | No | Yearly credited rates and index returns |

### Calculators (stub — time constraint)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/calculator/income` | POST | Bearer | Income projection by age, state, amount, deferral, payout type — **returns empty results** (Phase 2) |
| `/api/calculator/growth` | POST | Bearer | Growth projection by age, state, amount, time horizon — **returns empty results** (Phase 2) |

### Clients (stub — Phase 3)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/clients` | GET | Bearer | List clients — returns empty until client CRUD is built |
| `/api/clients/{id}` | GET | Bearer | Single client — 404 if none |

### Comparison (stub — Phase 2)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/comparison` | POST | Bearer | Create comparison — placeholder message only |
| `/api/comparison/history` | GET | Bearer | Saved comparisons — returns empty |

### Illustration (stub — Phase 4)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/illustration/generate` | POST | Bearer | Generate PDF — placeholder, `pdf_url: null` |

---

## Features

### Implemented

- **Auth:** Register, login, JWT, protected routes, logout
- **Products:** Full list with pagination and filters (product type, carrier rating, state, rate, fee, surrender period, investment range)
- **Product detail:** Riders, index options, historical performance
- **Layout:** Sidebar navigation (Products, Income, Growth, Comparison, Clients)
- **Income / Growth calculators:** UI and API stubs; backend returns empty results (time constraint)
- **Comparison:** Page and API stubs (Phase 2)
- **Clients:** Page and API stubs; empty list (Phase 3)

### Not implemented (time constraint)

- **Income calculator logic** — real income base with deferral bonus, payout by age/type, rider fees
- **Growth calculator logic** — caps, participation, historical data in projections
- **Product comparison** — side‑by‑side view, save, export
- **Client CRUD** — add/edit/delete clients
- **PDF illustrations** — client-ready PDF generation

---

## Data disclaimer

All product data (carrier names, rates, riders, index options, historical performance) is **randomly populated** for demonstration. It does not represent real annuity products, carriers, or financial advice.

---

## Run locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Register, log in, and browse products. API docs: [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Deployment (Vercel + Railway)

- **Frontend (Vercel):** Root directory `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the backend URL (no trailing slash).
- **Backend (Railway):** Root directory `backend`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `DATABASE_URL` (Supabase pooler on port 6543 — required for Railway), `SECRET_KEY`, and `CORS_ORIGINS` (include the Vercel URL).
- **Database:** Use Supabase Connection Pooler (Transaction mode, port 6543), not the direct connection — Railway doesn’t support IPv6.

---

## Project structure

```
├── backend/               # FastAPI
│   ├── app/
│   │   ├── api/           # Auth, products, calculators, clients, comparison, illustration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic request/response
│   │   ├── utils/         # Auth (bcrypt, JWT)
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
├── frontend/              # React + Vite
│   └── src/
│       ├── components/    # Layout, ProductTable, FilterPanel
│       ├── pages/         # Login, Register, Dashboard, ProductDetail, Calculators, Comparison, Clients
│       ├── hooks/         # useAuth, useProducts
│       └── services/      # api, auth, products
├── EDA.ipynb              # Data spec exploration
└── dashboard_specs/       # Split schema Excel files
```
