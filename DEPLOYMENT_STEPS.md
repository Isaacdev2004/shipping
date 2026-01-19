# 🚀 Deployment Steps - Render Backend + Vercel Frontend

## Quick Summary
- **Backend**: Render.com (free tier available)
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

**Or use this pre-generated one:**
```
SECRET_KEY=*ykgn+fbv-4@77_7vwk^ewm%znr#(eov!7&jrpw*dfsks8egwf
```

---

## STEP 2: Deploy Backend to Render (5 minutes)

1. **Visit**: https://render.com
2. **Sign up** with GitHub (easiest - connects to your repo automatically)
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**:
   - Select: `Isaacdev2004/shipping`
   - Or paste: `https://github.com/Isaacdev2004/shipping.git`
5. **Configure the service**:
   - **Name**: `shipping-backend` (or any name you like)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: `shipping_backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```
     pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data
     ```
   - **Start Command**: 
     ```
     gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
6. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   SECRET_KEY=<paste-the-key-from-step-1>
   DEBUG=False
   ALLOWED_HOSTS=shipping-backend.onrender.com
   ```
   (Replace `shipping-backend` with your actual service name if different)
7. **Click "Create Web Service"**
8. **Wait for deployment** (takes 3-5 minutes)
   - Watch the build logs
   - Should see: "Your service is live"
9. **Get your backend URL**:
   - Render shows: `https://shipping-backend.onrender.com`
   - **Test it**: Visit `https://shipping-backend.onrender.com/api/shipments/`
   - Should see DRF API page ✅
   - **Copy this URL** - you'll need it for frontend!

---

## STEP 3: Deploy Frontend to Vercel (5 minutes)

1. **Visit**: https://vercel.com
2. **Sign up** with GitHub
3. **Click "Add New"** → **"Project"**
4. **Import your GitHub repository**:
   - Select: `Isaacdev2004/shipping`
5. **Configure**:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `shipping-frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
6. **Environment Variables** → Click "Add" → Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://shipping-backend.onrender.com` (from Step 2)
   - ⚠️ **IMPORTANT**: Replace with your actual Render backend URL
   - Click "Save"
7. **Click "Deploy"** button
8. **Wait for build** (takes 2-3 minutes)
9. **Get your frontend URL**:
   - Vercel shows: `https://your-app.vercel.app`
   - **Copy this URL** - you'll need it for CORS!

---

## STEP 4: Update Backend CORS (2 minutes)

1. **Go back to Render** → Your backend service → **Environment** tab
2. **Add new environment variable**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Use the URL from Step 3)
3. **Save** - Render will auto-redeploy
4. **Wait for redeploy** (watch the logs)

---

## STEP 5: Test Everything (2 minutes)

1. **Visit your frontend URL** (from Step 3)
2. **Upload CSV file** (use Template.csv)
3. **Complete the flow**:
   - Upload → Review → Select Shipping → Purchase
4. **✅ Success!**

---

## 🎉 You're Live!

**Backend**: `https://shipping-backend.onrender.com`  
**Frontend**: `https://your-app.vercel.app`

**Save both URLs** - you'll need them for submission!

---

## 🆘 Troubleshooting

### Backend Issues (Render)

**Build fails?**
- Check Render logs (click service → Logs tab)
- Verify `requirements.txt` is in `shipping_backend` folder
- Check build command is correct
- Ensure root directory is set to `shipping_backend`

**500 Error after deployment?**
- Check Render logs
- Verify SECRET_KEY is set correctly
- Check ALLOWED_HOSTS includes your Render domain
- Ensure migrations ran successfully

**Can't access API?**
- Visit: `https://your-backend.onrender.com/api/shipments/`
- Should see DRF browsable API
- If 404, check root directory setting

**Service goes to sleep?**
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- This is normal for free tier

### Frontend Issues

**Can't connect to backend?**
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console (F12) for errors
- Ensure backend URL is accessible

**CORS errors?**
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in Render
- Wait for redeploy
- Clear browser cache

---

## 📝 Render-Specific Notes

### Free Tier Limitations:
- **Spins down after 15 min inactivity** (first request is slow)
- **750 hours/month free** (enough for 2+ weeks)
- **Auto-deploys** on git push to main branch

### To Keep Service Awake:
- Use a service like UptimeRobot (free) to ping your backend every 10 minutes
- Or upgrade to paid tier

### Database:
- Render free tier includes PostgreSQL
- Currently using SQLite (works fine for demo)
- Can upgrade to PostgreSQL later if needed

---

## ✅ Final Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL tested (shows DRF API)
- [ ] Frontend deployed on Vercel
- [ ] CORS updated in Render
- [ ] Full flow tested end-to-end
- [ ] Both URLs saved
- [ ] Ready for submission!

---

## 🔄 Updating Code

After making changes:
1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
2. **Render auto-deploys** (if connected to GitHub)
3. **Vercel auto-deploys** (if connected to GitHub)

Both platforms watch your GitHub repo and auto-deploy on push!

---

**Let's deploy! 🚀**
