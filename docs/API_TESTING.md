# API Testing Guide

Complete guide to test all features and APIs in the Annuities Analysis Platform.

**Base URL:** `http://localhost:8000`  
**API Docs (Swagger):** http://localhost:8000/docs

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Product APIs](#2-product-apis)
3. [Calculator APIs](#3-calculator-apis)
4. [Client APIs](#4-client-apis)
5. [Comparison APIs](#5-comparison-apis)
6. [Illustration APIs](#6-illustration-apis)
7. [Quick Test Script](#7-quick-test-script)

---

## Prerequisites

- Backend running: `uvicorn app.main:app --reload --port 8000`
- Use **cURL**, **Postman**, or the built-in Swagger UI at http://localhost:8000/docs

---

## 1. Authentication APIs

### 1.1 Register (Create Account)

**Endpoint:** `POST /api/auth/register`  
**Auth:** None

**Request body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "testpass123",
  "full_name": "Test User",
  "company_name": "Test Company",
  "role": "advisor"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","full_name":"Test User","role":"advisor"}'
```

**Expected response (201):**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "full_name": "Test User",
  "company_name": "Test Company",
  "role": "advisor",
  "is_active": true,
  "created_at": "2024-02-16T..."
}
```

---

### 1.2 Login (Get Token)

**Endpoint:** `POST /api/auth/login`  
**Auth:** None  
**Content-Type:** `application/x-www-form-urlencoded` (OAuth2 form)

**cURL:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpass123"
```

**Expected response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Save the `access_token`** — use it in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <your-access-token>
```

---

### 1.3 Get Current User

**Endpoint:** `GET /api/auth/me`  
**Auth:** Bearer token required

**cURL:**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "full_name": "Test User",
  "company_name": "Test Company",
  "role": "advisor",
  "is_active": true,
  "created_at": "2024-02-16T..."
}
```

---

### 1.4 Refresh Token

**Endpoint:** `POST /api/auth/refresh`  
**Auth:** Bearer token required

**cURL:**
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):** New token, same format as login.

---

## 2. Product APIs

**Auth:** None required for product endpoints.

### 2.1 List Products

**Endpoint:** `GET /api/products`  
**Query params:** `product_type`, `carrier_rating`, `state`, `min_rate`, `max_fee`, `surrender_period`, `min_investment`, `max_investment`, `page`, `limit`

**cURL (all products):**
```bash
curl -X GET "http://localhost:8000/api/products?page=1&limit=20"
```

**cURL (with filters):**
```bash
# FIA products only
curl -X GET "http://localhost:8000/api/products?product_type=FIA"

# A+ rated carriers
curl -X GET "http://localhost:8000/api/products?carrier_rating=A%2B"

# Available in California
curl -X GET "http://localhost:8000/api/products?state=CA"

# Base rate at least 1.5%
curl -X GET "http://localhost:8000/api/products?min_rate=1.5"

# Max annual fee 1.5%
curl -X GET "http://localhost:8000/api/products?max_fee=1.5"

# Surrender period 10 years or less
curl -X GET "http://localhost:8000/api/products?surrender_period=10"

# Minimum investment $25,000
curl -X GET "http://localhost:8000/api/products?min_investment=25000"

# Combined filters
curl -X GET "http://localhost:8000/api/products?product_type=FIA&carrier_rating=A%2B&state=CA&page=1&limit=10"
```

**Expected response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "product_name": "Pacific Income Builder 10",
      "carrier_name": "Pacific Life",
      "carrier_rating": "A+",
      "product_type": "FIA",
      "state_availability": ["CA", "TX", "FL", ...],
      "surrender_period": 10,
      "base_rate": 1.5,
      "cap_rate": 5.5,
      "annual_fee": 0.95,
      "has_bonus": true,
      "bonus_percentage": 10,
      "minimum_investment": 25000,
      "maximum_investment": 2000000,
      "issue_ages_min": 50,
      "issue_ages_max": 85,
      ...
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

---

### 2.2 Get Product by ID

**Endpoint:** `GET /api/products/{product_id}`

**Steps:**
1. Get a product ID from the list products response.
2. Call this endpoint with that ID.

**cURL:**
```bash
curl -X GET "http://localhost:8000/api/products/PRODUCT_UUID_HERE"
```

**Expected response (200):** Single product object.

**Expected response (404):** `{"detail": "Product not found"}`

---

### 2.3 Get Product Income Riders

**Endpoint:** `GET /api/products/{product_id}/riders`

**cURL:**
```bash
curl -X GET "http://localhost:8000/api/products/PRODUCT_UUID_HERE/riders"
```

**Expected response (200):**
```json
[
  {
    "id": "uuid",
    "rider_name": "Pacific Income Builder 10 Income Rider",
    "rider_fee": 0.95,
    "deferral_bonus_rate": 7.5,
    "payout_percentage_single_age_65": 5,
    "payout_percentage_single_age_70": 5.75,
    "payout_percentage_single_age_75": 6.5,
    "payout_percentage_joint_age_65": 4.5,
    "payout_percentage_joint_age_70": 5.25,
    "payout_percentage_joint_age_75": 6,
    "lifetime_guarantee": true,
    "inflation_protection": false
  }
]
```

---

### 2.4 Get Product Index Options

**Endpoint:** `GET /api/products/{product_id}/index-options`

**cURL:**
```bash
curl -X GET "http://localhost:8000/api/products/PRODUCT_UUID_HERE/index-options"
```

**Expected response (200):**
```json
[
  {
    "id": "uuid",
    "index_name": "S&P 500 Annual Point-to-Point",
    "index_type": "Point-to-Point",
    "cap_rate": 5.5,
    "participation_rate": 100,
    "spread_fee": null,
    "floor_rate": 0
  }
]
```

---

### 2.5 Get Product Historical Performance

**Endpoint:** `GET /api/products/{product_id}/historical-performance`

**cURL:**
```bash
curl -X GET "http://localhost:8000/api/products/PRODUCT_UUID_HERE/historical-performance"
```

**Expected response (200):**
```json
[
  {"id": "uuid", "year": 2019, "credited_rate": 4.25, "index_return": 28.88, "effective_return": 3.5},
  {"id": "uuid", "year": 2020, "credited_rate": 2.1, "index_return": 16.26, "effective_return": 1.35},
  ...
]
```

---

## 3. Calculator APIs

**Auth:** Bearer token required. (Stub endpoints — return empty results.)

### 3.1 Income Calculator

**Endpoint:** `POST /api/calculator/income`

**Request body:**
```json
{
  "age": 65,
  "gender": "male",
  "state": "CA",
  "investment_amount": 100000,
  "deferral_years": 0,
  "payout_type": "single",
  "filters": {
    "product_types": ["FIA"],
    "carrier_ratings": ["A+", "A"],
    "max_surrender_period": 10,
    "max_annual_fee": 1.5
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/calculator/income \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age":65,"gender":"male","state":"CA","investment_amount":100000,"deferral_years":0,"payout_type":"single"}'
```

**Expected response (200):** `{"results": [], "total_results": 0, "page": 1}` (stub)

---

### 3.2 Growth Calculator

**Endpoint:** `POST /api/calculator/growth`

**Request body:**
```json
{
  "age": 55,
  "state": "TX",
  "investment_amount": 250000,
  "time_horizon": 10,
  "filters": {}
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/calculator/growth \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age":55,"state":"TX","investment_amount":250000,"time_horizon":10}'
```

**Expected response (200):** `{"results": [], "total_results": 0, "page": 1}` (stub)

---

## 4. Client APIs

**Auth:** Bearer token required.

### 4.1 List Clients

**Endpoint:** `GET /api/clients`

**cURL:**
```bash
curl -X GET http://localhost:8000/api/clients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):** `{"items": []}` (empty until you create clients in Phase 3)

---

### 4.2 Get Client by ID

**Endpoint:** `GET /api/clients/{client_id}`

**cURL:**
```bash
curl -X GET "http://localhost:8000/api/clients/CLIENT_UUID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (404):** `{"detail": "Client not found"}` (if no clients exist)

---

## 5. Comparison APIs

**Auth:** Bearer token required. (Stub endpoints)

### 5.1 Create Comparison

**Endpoint:** `POST /api/comparison`

**cURL:**
```bash
curl -X POST http://localhost:8000/api/comparison \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):** `{"message": "Comparison endpoint - Phase 2"}`

---

### 5.2 Get Comparison History

**Endpoint:** `GET /api/comparison/history`

**cURL:**
```bash
curl -X GET http://localhost:8000/api/comparison/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):** `{"items": []}`

---

## 6. Illustration APIs

**Auth:** Bearer token required. (Stub)

### 6.1 Generate Illustration

**Endpoint:** `POST /api/illustration/generate`

**cURL:**
```bash
curl -X POST http://localhost:8000/api/illustration/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):** `{"message": "Illustration endpoint - Phase 4", "pdf_url": null}`

---

## 7. Quick Test Script

Save as `test_api.sh` and run: `chmod +x test_api.sh && ./test_api.sh`

```bash
#!/bin/bash
BASE="http://localhost:8000"

echo "1. Health check..."
curl -s "$BASE/"

echo -e "\n\n2. Register..."
REG=$(curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest'$(date +%s)'@test.com","password":"test123","full_name":"API Test"}')
echo $REG | head -c 200
echo "..."

echo -e "\n\n3. Login..."
EMAIL=$(echo $REG | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
LOGIN=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$EMAIL&password=test123")
TOKEN=$(echo $LOGIN | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "Token: ${TOKEN:0:50}..."

echo -e "\n\n4. Get /api/auth/me..."
curl -s "$BASE/api/auth/me" -H "Authorization: Bearer $TOKEN" | head -c 300
echo "..."

echo -e "\n\n5. List products..."
curl -s "$BASE/api/products?limit=3" | head -c 500
echo "..."

echo -e "\n\n6. List products (FIA filter)..."
curl -s "$BASE/api/products?product_type=FIA&limit=2" | head -c 400
echo "..."

echo -e "\n\nDone. Use token for protected endpoints."
```

---

## Summary Table

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/auth/register` | POST | No | ✅ Full |
| `/api/auth/login` | POST | No | ✅ Full |
| `/api/auth/me` | GET | Yes | ✅ Full |
| `/api/auth/refresh` | POST | Yes | ✅ Full |
| `/api/products` | GET | No | ✅ Full |
| `/api/products/{id}` | GET | No | ✅ Full |
| `/api/products/{id}/riders` | GET | No | ✅ Full |
| `/api/products/{id}/index-options` | GET | No | ✅ Full |
| `/api/products/{id}/historical-performance` | GET | No | ✅ Full |
| `/api/calculator/income` | POST | Yes | Stub |
| `/api/calculator/growth` | POST | Yes | Stub |
| `/api/clients` | GET | Yes | Stub |
| `/api/clients/{id}` | GET | Yes | Stub |
| `/api/comparison` | POST | Yes | Stub |
| `/api/comparison/history` | GET | Yes | Stub |
| `/api/illustration/generate` | POST | Yes | Stub |

---

## Using Swagger UI

1. Open http://localhost:8000/docs
2. Click **Authorize**
3. Login via `POST /api/auth/login` (use "Authorize" or run the login request)
4. Enter your token in the Bearer field
5. Click **Authorize** and **Close**
6. All endpoints can now be tested from the UI
