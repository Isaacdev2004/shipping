# Deployment Guide

This guide covers deploying the Bulk Shipping Label Creation Platform to production.

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Backend:**
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo" (or upload code)
3. Select your repository or upload the `shipping_backend` folder
4. Railway will auto-detect Python and install dependencies
5. Add environment variables:
   - `SECRET_KEY`: Generate a Django secret key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-app-name.up.railway.app`
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL (set after frontend deployment)
6. Railway will provide a URL like: `https://your-app.up.railway.app`

**Frontend:**
1. Build the frontend: `cd shipping-frontend && npm run build`
2. Deploy to Vercel or Netlify (see below)

---

### Option 2: Render (Free Tier Available)

**Backend:**
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo or upload code
4. Settings:
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data`
   - **Start Command**: `gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Environment**: Python 3
5. Add environment variables (same as Railway)
6. Deploy!

**Frontend:**
- Use Vercel or Netlify (see below)

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Frontend Deployment (Vercel):**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" → Import your repository
3. Settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `shipping-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
5. Deploy!

**Update Backend CORS:**
- Add your Vercel URL to `CORS_ALLOWED_ORIGINS` in backend environment variables

---

## 📋 Pre-Deployment Checklist

### Backend
- [x] Add `gunicorn` and `whitenoise` to requirements.txt
- [x] Configure static files
- [x] Set up production settings
- [x] Create Procfile
- [x] Test migrations locally

### Frontend
- [x] Set API URL environment variable
- [x] Build production bundle
- [x] Test build locally

---

## 🔧 Manual Deployment Steps

### Backend (Railway/Render)

1. **Prepare the code:**
   ```bash
   cd shipping_backend
   # Ensure requirements.txt includes gunicorn and whitenoise
   ```

2. **Set environment variables:**
   - `SECRET_KEY`: Generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: Your domain
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL

3. **Deploy:**
   - Push to GitHub and connect to Railway/Render
   - Or upload directly to the platform

### Frontend (Vercel/Netlify)

1. **Build locally (test first):**
   ```bash
   cd shipping-frontend
   npm run build
   # Test: serve -s build (if you have serve installed)
   ```

2. **Set environment variable:**
   - `REACT_APP_API_URL`: Your backend URL

3. **Deploy:**
   - Connect GitHub repo to Vercel/Netlify
   - Or drag-and-drop the `build` folder

---

## 🌐 Environment Variables Reference

### Backend
```bash
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=postgresql://... (optional, uses SQLite if not set)
```

### Frontend
```bash
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## 🧪 Testing Deployment

1. **Backend:**
   - Visit: `https://your-backend.railway.app/api/shipments/`
   - Should see DRF browsable API

2. **Frontend:**
   - Visit your frontend URL
   - Try uploading a CSV file
   - Complete the full flow

---

## 📝 Post-Deployment

1. Update README with live URLs
2. Test all features end-to-end
3. Monitor logs for errors
4. Ensure it stays live for 2+ weeks (as required)

---

## 🆘 Troubleshooting

**Backend 500 errors:**
- Check logs in Railway/Render dashboard
- Verify environment variables are set
- Ensure migrations ran successfully

**CORS errors:**
- Add frontend URL to `CORS_ALLOWED_ORIGINS`
- Restart backend after adding

**Frontend can't connect to backend:**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend is accessible (visit API URL directly)
- Ensure CORS is configured

---

## 🎯 Recommended Setup

**Easiest Path:**
1. Backend: Railway (auto-detects Python, easy setup)
2. Frontend: Vercel (excellent React support, free tier)

**Most Reliable:**
1. Backend: Render (free PostgreSQL, reliable)
2. Frontend: Netlify (great free tier)

Both options are free for small projects and will keep the app live for 2+ weeks!
