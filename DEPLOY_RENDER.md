# 🚀 Deploy Backend to Render - Step by Step

## Prerequisites
- GitHub repository: https://github.com/Isaacdev2004/shipping.git
- Code is already pushed to GitHub ✅

---

## Step-by-Step: Render Backend Deployment

### 1. Sign Up / Login to Render
- Go to: https://render.com
- Click "Get Started for Free"
- **Sign up with GitHub** (recommended - connects your repo automatically)

### 2. Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**

### 3. Connect GitHub Repository
1. **Option A: If signed in with GitHub**
   - Your repositories will appear
   - Select: `Isaacdev2004/shipping`
   
2. **Option B: Manual connection**
   - Click "Connect a repository"
   - Paste: `https://github.com/Isaacdev2004/shipping.git`
   - Authorize Render to access your GitHub

### 4. Configure Service Settings

**Basic Settings:**
- **Name**: `shipping-backend` (or any name)
- **Region**: Choose closest (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `shipping_backend` ⚠️ **IMPORTANT!**

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
- Select **"Free"** (750 hours/month - enough for 2+ weeks)

### 5. Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Add these variables:

```
SECRET_KEY=*ykgn+fbv-4@77_7vwk^ewm%znr#(eov!7&jrpw*dfsks8egwf
```

```
DEBUG=False
```

```
ALLOWED_HOSTS=shipping-backend.onrender.com
```
(Replace `shipping-backend` with your actual service name)

### 6. Deploy!

1. Click **"Create Web Service"**
2. **Watch the build logs**:
   - Installing dependencies...
   - Running migrations...
   - Seeding data...
   - Starting gunicorn...
3. Wait 3-5 minutes for first deployment
4. **Success!** You'll see: "Your service is live"

### 7. Get Your Backend URL

Render provides: `https://shipping-backend.onrender.com`

**Test it:**
- Visit: `https://shipping-backend.onrender.com/api/shipments/`
- Should see Django REST Framework API browser ✅

---

## Next: Deploy Frontend

After backend is live, deploy frontend to Vercel (see `DEPLOYMENT_STEPS.md` Step 3).

Then update CORS in Render with your frontend URL.

---

## 🔧 Render Dashboard Tips

**View Logs:**
- Click your service → "Logs" tab
- Real-time logs for debugging

**Environment Variables:**
- Click service → "Environment" tab
- Add/edit variables anytime
- Auto-redeploys when you save

**Manual Deploy:**
- Click "Manual Deploy" → "Deploy latest commit"
- Useful for testing

**Service Settings:**
- Click service → "Settings" tab
- Change build/start commands
- Update instance type

---

## ⚠️ Important Notes

1. **Root Directory**: Must be `shipping_backend` (not the repo root)
2. **Build Command**: Runs in root directory, so use `requirements.txt` (it's in parent)
3. **Start Command**: Runs in root directory, so path is `shipping_backend.wsgi`
4. **Free Tier**: Spins down after 15 min inactivity (first request is slow)
5. **Auto-Deploy**: Render watches your GitHub repo and auto-deploys on push

---

## 🆘 Common Issues

**Build fails with "requirements.txt not found"?**
- Check Root Directory is set to `shipping_backend`
- Requirements.txt is in parent directory, so path should work

**500 Error after deployment?**
- Check logs in Render dashboard
- Verify SECRET_KEY is set
- Check ALLOWED_HOSTS matches your Render URL

**Service won't start?**
- Check Start Command is correct
- Verify gunicorn is in requirements.txt
- Check logs for error messages

---

## ✅ Success Checklist

- [ ] Service created on Render
- [ ] Build completed successfully
- [ ] Service is "Live"
- [ ] API accessible at `/api/shipments/`
- [ ] Ready to deploy frontend!

---

**Ready to deploy? Follow the steps above! 🚀**
