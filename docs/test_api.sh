#!/bin/bash
# Quick API test script — run with: chmod +x docs/test_api.sh && ./docs/test_api.sh

BASE="${API_BASE_URL:-http://localhost:8000}"

echo "=== Annuities API Test Script ==="
echo "Base URL: $BASE"
echo ""

echo "1. Health check..."
curl -s "$BASE/" | head -c 200
echo -e "\n"

echo "2. Register new user..."
TS=$(date +%s)
REG=$(curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"apitest${TS}@test.com\",\"password\":\"test123\",\"full_name\":\"API Test User\"}")
echo "$REG" | head -c 300
echo -e "\n"

echo "3. Login..."
EMAIL=$(echo "$REG" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
LOGIN=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${EMAIL}&password=test123")
TOKEN=$(echo "$LOGIN" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then echo "Login failed"; exit 1; fi
echo "Token obtained (length: ${#TOKEN})"

echo "4. GET /api/auth/me..."
curl -s "$BASE/api/auth/me" -H "Authorization: Bearer $TOKEN" | head -c 250
echo -e "\n"

echo "5. GET /api/products (first 3)..."
curl -s "$BASE/api/products?limit=3" | head -c 600
echo -e "\n"

echo "6. GET /api/products?product_type=FIA..."
curl -s "$BASE/api/products?product_type=FIA&limit=2" | head -c 500
echo -e "\n"

echo "=== Tests complete ==="
