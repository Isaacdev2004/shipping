# 🚀 Deploy Now - Step by Step

## ⚡ Fastest Deployment (Railway + Vercel)

### Part 1: Backend on Railway (5 minutes)

1. **Go to Railway**: https://railway.app
   - Sign up with GitHub (easiest)

2. **Create New Project**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo" OR "Empty Project"
   
3. **If using GitHub**:
   - Select your repository
   - Set **Root Directory** to: `shipping_backend`
   - Railway auto-detects Python

4. **If uploading manually**:
   - Click "Empty Project"
   - Upload the `shipping_backend` folder
   - Railway detects Python automatically

5. **Generate Secret Key** (run locally):
   ```powershell
   cd shipping_backend
   ..\venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   Copy the output!

6. **Add Environment Variables** (Railway dashboard → Variables):
   ```
   SECRET_KEY=<paste-the-generated-key>
   DEBUG=False
   ALLOWED_HOSTS=*.up.railway.app
   ```

7. **Deploy!** Railway will:
   - Install dependencies automatically
   - Run migrations
   - Start the server

8. **Get Backend URL**:
   - Railway provides: `https://your-app-name.up.railway.app`
   - Test: Visit `https://your-app-name.up.railway.app/api/shipments/`
   - Should see DRF API page ✅

---

### Part 2: Frontend on Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com
   - Sign up with GitHub

2. **New Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `shipping-frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

4. **Environment Variables**:
   - Add: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.up.railway.app`
   - (Use the URL from Part 1, Step 8)

5. **Deploy!** Vercel will build and deploy automatically

6. **Get Frontend URL**:
   - Vercel provides: `https://your-app.vercel.app`

---

### Part 3: Update CORS (2 minutes)

1. **Go back to Railway** → Your backend service → Variables

2. **Add Environment Variable**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Use the URL from Part 2, Step 6)

3. **Railway auto-redeploys** when you save variables

---

### Part 4: Test Everything (3 minutes)

1. Visit your frontend URL
2. Upload the CSV file (Template.csv)
3. Complete the full flow:
   - Upload → Review → Select Shipping → Purchase
4. ✅ Success!

---

## 🎉 You're Live!

**Backend**: `https://your-app.up.railway.app`  
**Frontend**: `https://your-app.vercel.app`

Both are FREE and will stay live for 2+ weeks!

---

## 📋 Quick Checklist

- [ ] Backend deployed on Railway
- [ ] Backend URL tested (shows DRF API)
- [ ] Frontend deployed on Vercel
- [ ] CORS updated in backend
- [ ] Full flow tested end-to-end
- [ ] Both URLs saved for submission

---

## 🆘 Troubleshooting

**Backend 500 error?**
- Check Railway logs (click on service → Logs)
- Verify SECRET_KEY is set
- Check ALLOWED_HOSTS includes your domain

**Frontend can't connect?**
- Verify REACT_APP_API_URL is correct
- Check browser console for errors
- Ensure backend is accessible (visit API URL directly)

**CORS errors?**
- Add frontend URL to CORS_ALLOWED_ORIGINS
- Restart backend (Railway auto-restarts)

---

## 📝 Alternative: Render.com

If Railway doesn't work:

1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - **Build Command**: `cd shipping_backend && pip install -r ../requirements.txt && python manage.py migrate && python manage.py seed_data`
   - **Start Command**: `cd shipping_backend && gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT`
4. Add environment variables (same as Railway)
5. Deploy!

---

**Ready? Let's deploy! 🚀**
