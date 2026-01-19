# 🚀 Quick Deployment Guide (15 minutes)

## Step 1: Deploy Backend (Railway) - 5 minutes

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** (use GitHub for easy setup)
3. **New Project** → **Deploy from GitHub repo** (or "Empty Project" to upload)
4. **If using GitHub:**
   - Select your repository
   - Railway auto-detects Python
   - Set root directory to: `shipping_backend`
5. **If uploading:**
   - Upload the `shipping_backend` folder
   - Railway will detect Python automatically

6. **Add Environment Variables:**
   - Click on your service → Variables tab
   - Add these:
     ```
     SECRET_KEY=<generate-this>
     DEBUG=False
     ALLOWED_HOSTS=*.up.railway.app
     ```
   - To generate SECRET_KEY, run locally:
     ```bash
     python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
     ```

7. **Deploy!** Railway will automatically:
   - Install dependencies
   - Run migrations
   - Start the server

8. **Get your backend URL:**
   - Railway provides: `https://your-app-name.up.railway.app`
   - Test it: Visit `https://your-app-name.up.railway.app/api/shipments/`

---

## Step 2: Deploy Frontend (Vercel) - 5 minutes

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub)
3. **New Project** → Import your GitHub repository
4. **Configure:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `shipping-frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

5. **Environment Variables:**
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.up.railway.app`
   - (Use the URL from Step 1)

6. **Deploy!** Vercel will build and deploy automatically

7. **Get your frontend URL:**
   - Vercel provides: `https://your-app.vercel.app`

---

## Step 3: Update Backend CORS - 2 minutes

1. **Go back to Railway** → Your backend service → Variables
2. **Add:**
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
3. **Redeploy** (Railway auto-redeploys when vars change)

---

## Step 4: Test - 3 minutes

1. Visit your frontend URL
2. Try uploading the CSV file
3. Complete the full flow
4. ✅ Done!

---

## 🎉 You're Live!

**Backend URL**: `https://your-app.up.railway.app`  
**Frontend URL**: `https://your-app.vercel.app`

Both platforms offer free tiers that will keep your app live for 2+ weeks!

---

## 🆘 Need Help?

**Backend not working?**
- Check Railway logs
- Verify environment variables
- Test API directly: `https://your-backend.up.railway.app/api/shipments/`

**Frontend can't connect?**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Open browser console for errors

**CORS errors?**
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend
- Restart backend after adding

---

## 📝 Alternative: Render.com

If Railway doesn't work, use Render:

**Backend:**
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Build: `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data`
   - Start: `gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:$PORT`
4. Add environment variables (same as Railway)
5. Deploy!

**Frontend:**
- Use Vercel (same as above) or Netlify
