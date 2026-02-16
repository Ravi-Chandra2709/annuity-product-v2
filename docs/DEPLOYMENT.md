# Deployment Guide: Vercel (Frontend) + Railway (Backend)

## Prerequisites

- GitHub repo with the project pushed
- Vercel account (linked to GitHub)
- Railway account (linked to GitHub)
- Supabase database URL and credentials

---

## Part 1: Deploy Backend to Railway

### 1. Create a new project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your repository
4. Railway will detect the project — you may need to configure it (see below)

### 2. Configure the backend service

1. Click the service → **Settings**
2. Set **Root Directory** to `backend`
3. Set **Build Command** to: `pip install -r requirements.txt`
4. Set **Start Command** to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   (Railway sets `$PORT` automatically.)

### 3. Set Python version (avoid 3.13)

Railway defaults to Python 3.13, which can break some packages. Add this **build variable** (or rely on `runtime.txt` in `backend/`):

| Variable | Value |
|----------|-------|
| `RAILPACK_PYTHON_VERSION` | `3.11` |

The `backend/runtime.txt` file already pins Python 3.11; if the build still fails, set the variable above.

### 4. Add environment variables

Go to **Variables** and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase connection string (e.g. `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres?sslmode=require`) |
| `SECRET_KEY` | A strong random string (32+ chars) |
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` *(update after you get your Vercel URL)* |

### 5. Deploy

- Push to your main branch or click **Deploy**
- Wait for the build to finish
- Copy your **Public URL** (e.g. `https://your-backend.up.railway.app`)

You’ll need this URL for the frontend.

---

## Part 2: Deploy Frontend to Vercel

### 1. Import the project

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 2. Add environment variable

In **Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Railway backend URL (e.g. `https://your-backend.up.railway.app`) |

⚠️ No trailing slash. This is the base URL for all API requests.

### 3. Deploy

- Click **Deploy**
- Wait for the build
- Copy your Vercel URL (e.g. `https://your-app.vercel.app`)

---

## Part 3: Update CORS (if needed)

1. In **Railway** → your backend service → **Variables**
2. Set `CORS_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app,http://localhost:5173
   ```
3. Redeploy the backend so the change takes effect.

---

## Part 4: Verify

1. Open your Vercel URL in the browser
2. Register or log in
3. Confirm products load and the API responds
4. Check the browser console for CORS or 404 errors if something fails

---

## Quick Reference

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://your-app.vercel.app` |
| Backend (Railway) | `https://your-backend.up.railway.app` |
| API Docs | `https://your-backend.up.railway.app/docs` |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Ensure `CORS_ORIGINS` includes your exact Vercel URL (with `https://`) |
| 401 / Auth fails | Ensure `SECRET_KEY` is set on Railway and matches between deployments |
| Blank page | Confirm `VITE_API_URL` is set on Vercel and points to the Railway backend |
| DB connection fails | Check `DATABASE_URL` on Railway; ensure Supabase allows connections from Railway IPs if restricted |
