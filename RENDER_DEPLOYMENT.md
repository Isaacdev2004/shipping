# 🚀 Deploy Backend to Render - Complete Guide

## Prerequisites ✅
- GitHub repository: https://github.com/Isaacdev2004/shipping.git
- Code is pushed to GitHub ✅
- Requirements.txt is in `shipping_backend` folder ✅

---

## Step-by-Step Instructions

### 1. Sign Up / Login to Render

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (recommended - auto-connects your repos)

### 2. Create New Web Service

1. Click **"New +"** button (top right corner)
2. Select **"Web Service"**

### 3. Connect GitHub Repository

**Option A: If signed in with GitHub**
- Your repositories will appear automatically
- Find and select: **`Isaacdev2004/shipping`**

**Option B: Manual connection**
- Click "Connect a repository"
- Paste: `https://github.com/Isaacdev2004/shipping.git`
- Authorize Render to access your GitHub

### 4. Configure Service

Fill in these settings:

**Basic Information:**
- **Name**: `shipping-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `shipping_backend` ⚠️ **CRITICAL - Must be this!**

**Build & Deploy:**
- **Runtime**: `Python 3`
- **Build Command**: 
  ```
  pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data
  ```
- **Start Command**: 
  ```
  gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT
  ```

**Instance Type:**
- Select **"Free"** (750 hours/month - more than enough for 2+ weeks)

### 5. Add Environment Variables

Click **"Advanced"** → Scroll down to **"Environment Variables"**

Click **"Add Environment Variable"** for each:

**Variable 1:**
- **Key**: `SECRET_KEY`
- **Value**: `*ykgn+fbv-4@77_7vwk^ewm%znr#(eov!7&jrpw*dfsks8egwf`

**Variable 2:**
- **Key**: `DEBUG`
- **Value**: `False`

**Variable 3:**
- **Key**: `ALLOWED_HOSTS`
- **Value**: `shipping-backend.onrender.com`
  - ⚠️ Replace `shipping-backend` with your actual service name if different

**Variable 4 (add after frontend is deployed):**
- **Key**: `CORS_ALLOWED_ORIGINS`
- **Value**: `https://your-frontend.vercel.app`
  - Add this after you deploy the frontend

### 6. Deploy!

1. Click **"Create Web Service"** button (bottom)
2. **Watch the build logs**:
   - "Cloning repository..."
   - "Installing dependencies..."
   - "Running migrations..."
   - "Seeding data..."
   - "Starting gunicorn..."
3. **First deployment takes 3-5 minutes**
4. **Success!** You'll see: "Your service is live at..."

### 7. Get Your Backend URL

Render will show: `https://shipping-backend.onrender.com`

**Test it:**
- Visit: `https://shipping-backend.onrender.com/api/shipments/`
- Should see Django REST Framework browsable API ✅
- If you see the API, backend is working!

---

## 📋 Render Configuration Summary

| Setting | Value |
|---------|-------|
| Name | shipping-backend |
| Root Directory | `shipping_backend` |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data` |
| Start Command | `gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT` |
| Environment Variables | SECRET_KEY, DEBUG, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS |

---

## 🔄 After Backend is Live

1. **Deploy Frontend to Vercel** (see `DEPLOYMENT_STEPS.md` Step 3)
2. **Get your frontend URL**
3. **Update CORS in Render**:
   - Go to Render → Your service → Environment
   - Add: `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
   - Save (auto-redeploys)

---

## 🆘 Troubleshooting

### Build Fails

**"requirements.txt not found"**
- ✅ Fixed: requirements.txt is now in `shipping_backend` folder
- Verify Root Directory is set to `shipping_backend`

**"Module not found"**
- Check build logs
- Verify all packages are in requirements.txt
- Check Python version (should be 3.11+)

### Service Won't Start

**"gunicorn: command not found"**
- Verify gunicorn is in requirements.txt ✅
- Check build logs to see if it installed

**"Application failed to respond"**
- Check Start Command is correct
- Verify path: `shipping_backend.wsgi:application`
- Check logs for error messages

### 500 Errors

**After deployment, API returns 500**
- Check Render logs (click service → Logs tab)
- Verify SECRET_KEY is set
- Check ALLOWED_HOSTS matches your Render URL
- Ensure migrations ran successfully

### Service Goes to Sleep

**First request is slow (~30 seconds)**
- Normal for Render free tier
- Service spins down after 15 min inactivity
- First request "wakes it up" (cold start)
- Subsequent requests are fast

**To keep it awake:**
- Use UptimeRobot (free) to ping every 10 minutes
- Or upgrade to paid tier

---

## ✅ Success Checklist

- [ ] Service created on Render
- [ ] Build completed successfully (green checkmark)
- [ ] Service status shows "Live"
- [ ] API accessible: `https://your-backend.onrender.com/api/shipments/`
- [ ] Can see DRF browsable API page
- [ ] Ready to deploy frontend!

---

## 📝 Next Steps

After backend is live:
1. Deploy frontend to Vercel
2. Update CORS in Render
3. Test the full flow
4. Save both URLs for submission

---

**Ready? Go to Render.com and follow the steps above! 🚀**
