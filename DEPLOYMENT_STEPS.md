# 🚀 Deployment Steps - Follow This Guide

## Quick Summary
- **Backend**: Railway.app (free, auto-detects Python)
- **Frontend**: Vercel.com (free, excellent React support)
- **Time**: ~15 minutes total

---

## STEP 1: Prepare Secret Key (1 minute)

Run this locally to generate a secret key:
```powershell
cd shipping_backend
..\venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Copy the output** - you'll need it in Step 2!

---

## STEP 2: Deploy Backend to Railway (5 minutes)

1. **Visit**: https://railway.app
2. **Sign up** with GitHub (easiest)
3. **Click "New Project"** → **"Deploy from GitHub repo"**
   - If you don't have GitHub repo, choose **"Empty Project"** and upload `shipping_backend` folder
4. **If using GitHub**:
   - Select your repository
   - Set **Root Directory** to: `shipping_backend`
5. **Wait for Railway to detect Python** (automatic)
6. **Go to Variables tab** and add:
   ```
   SECRET_KEY=<paste-the-key-from-step-1>
   DEBUG=False
   ALLOWED_HOSTS=*.up.railway.app
   ```
7. **Railway auto-deploys!** Wait for it to finish
8. **Get your backend URL**:
   - Railway shows: `https://your-app-name.up.railway.app`
   - **Test it**: Visit `https://your-app-name.up.railway.app/api/shipments/`
   - Should see DRF API page ✅
   - **Copy this URL** - you'll need it for frontend!

---

## STEP 3: Deploy Frontend to Vercel (5 minutes)

1. **Visit**: https://vercel.com
2. **Sign up** with GitHub
3. **Click "Add New"** → **"Project"**
4. **Import your GitHub repository**
5. **Configure**:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `shipping-frontend`
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `build` (auto)
6. **Environment Variables** → Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.up.railway.app` (from Step 2)
7. **Click "Deploy"**
8. **Wait for build** (takes 2-3 minutes)
9. **Get your frontend URL**:
   - Vercel shows: `https://your-app.vercel.app`
   - **Copy this URL** - you'll need it for CORS!

---

## STEP 4: Update Backend CORS (2 minutes)

1. **Go back to Railway** → Your backend service → **Variables**
2. **Add new variable**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Use the URL from Step 3)
3. **Railway auto-redeploys** (watch the logs)

---

## STEP 5: Test Everything (2 minutes)

1. **Visit your frontend URL** (from Step 3)
2. **Upload CSV file** (use Template.csv)
3. **Complete the flow**:
   - Upload → Review → Select Shipping → Purchase
4. **✅ Success!**

---

## 🎉 You're Live!

**Backend**: `https://your-app.up.railway.app`  
**Frontend**: `https://your-app.vercel.app`

**Save both URLs** - you'll need them for submission!

---

## 🆘 Troubleshooting

### Backend Issues

**500 Error?**
- Check Railway logs (click service → Logs tab)
- Verify SECRET_KEY is set correctly
- Check ALLOWED_HOSTS includes `*.up.railway.app`

**Can't access API?**
- Visit: `https://your-backend.up.railway.app/api/shipments/`
- Should see DRF browsable API
- If 404, check root directory is set to `shipping_backend`

### Frontend Issues

**Can't connect to backend?**
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console (F12) for errors
- Ensure backend URL is accessible

**CORS errors?**
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in Railway
- Wait for redeploy
- Clear browser cache

---

## 📝 Alternative: Render.com

If Railway doesn't work:

1. Go to render.com → New Web Service
2. Connect GitHub or upload code
3. Settings:
   - **Build**: `cd shipping_backend && pip install -r ../requirements.txt && python manage.py migrate && python manage.py seed_data`
   - **Start**: `cd shipping_backend && gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT`
4. Add environment variables (same as Railway)
5. Deploy!

---

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible  
- [ ] CORS configured
- [ ] Full flow tested
- [ ] Both URLs saved
- [ ] Ready for submission!

**Let's deploy! 🚀**
