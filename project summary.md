# Annuities Analysis Platform — Project Summary

## 1. Approach & Data Analysis

**Data exploration:** The source was a data specification CSV (`data_specifications_01262026.xlsx - fa.csv`) — a schema definition with 244 column-level records across 11 Beacon Fixed Annuity tables. An EDA notebook was used to inspect columns, data types, nullability, and relationships.

**Steps:**
- Loaded the spec and grouped by `FILE_NAME` to understand each table.
- Summarized data types, ID columns, and cardinality per table.
- Split the spec into 11 Excel files (one per table) with Schema + Pivoted views for easier frontend/API use.
- Added a sanity check to confirm all 244 rows exist in the splits with no loss.

**Insight:** The spec describes Beacon tables (age, bonuses, companies, rates, waivers, etc.). The app uses a different schema (`annuity_products`, `income_riders`, etc.) from the project requirements, so we kept both: Beacon tables for reference and the app schema for the live product.

---

## 2. Schema & Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Supabase (PostgreSQL)** | Hosted DB, SSL, connection pooling. Direct connection on 5432 with `sslmode=require`. |
| **Separate app schema from Beacon spec** | Beacon tables come from existing docs; the app needs products, riders, and users for login, calculators, and comparisons. Both coexist. |
| **FastAPI + SQLAlchemy** | Async-friendly, auto-docs, strong typing. SQLAlchemy for migrations and future flexibility. |
| **React + Vite + TanStack Query** | Fast dev experience, built-in caching and refetch, minimal config. |
| **JWT for auth** | Stateless, works with proxies and SPAs; token stored in `localStorage`, sent via `Authorization` header. |
| **Products API public, calculators/auth protected** | Products are read-only and browsable; calculators and clients require login. |
| **One Excel per table** | Each table is isolated, easier to ingest in the frontend and for docs. |

---

## 3. How AI Was Used & What Worked

- **EDA and spec handling:** AI drafted the notebook and helped map CSV columns to SQL types for the Beacon schema script.
- **Project structure and boilerplate:** AI proposed folder layout, FastAPI routers, and React components from the requirements.
- **Schema generation:** AI wrote `generate_beacon_schema.py` to turn the spec CSV into PostgreSQL DDL.
- **API design:** Endpoints and request/response shapes were iterated with AI from the requirements.
- **Docs:** API_TESTING.md and README were generated and refined with AI.

**Effective patterns:** Defining clear interfaces (schemas, types) first; incremental testing (sanity checks, API tests); separating spec-driven Beacon tables from app-driven tables.

---

## 4. Next Steps With More Time

1. **Income/Growth calculators:** Implement real logic — income base with deferral bonus, payout percentages by age/type, rider fees; growth projections from caps, participation, and historical performance.
2. **Product comparison:** Full side‑by‑side view, export, and save for later.
3. **Client CRUD:** Add/edit/delete client profiles, link to comparisons and illustrations.
4. **PDF illustrations:** Generate client-ready PDFs with jsPDF or react-pdf.
5. **Beacon data integration:** Map Beacon tables into the app schema (or expose via separate APIs) and keep specs in sync.
6. **Testing:** Unit tests for calculators; integration tests for APIs; basic E2E for login and product list.
7. **UX polish:** Filters, loading states, error handling, and responsive layout.
8. **Security:** Row-level security in Supabase, rate limiting, and CSRF where applicable.
