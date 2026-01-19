# Troubleshooting CSV Upload 404 Error

## Issue
Getting 404 error when trying to upload CSV file to `/api/shipments/upload_csv/`

## Solution Steps

### 1. Restart Backend Server
**IMPORTANT**: After any code changes, you MUST restart the Django server:

```powershell
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
cd "C:\Users\HP\Downloads\New folder\shipping_backend"
..\venv\Scripts\python.exe manage.py runserver
```

### 2. Verify Server is Running
Open in browser: `http://localhost:8000/api/shipments/`

You should see the DRF browsable API page. If you see a 404, the server isn't running correctly.

### 3. Test the Endpoint Directly
Try accessing: `http://localhost:8000/api/shipments/upload_csv/`

If you see a DRF page (even if it says "Method not allowed" for GET), the endpoint exists.

### 4. Check Backend Logs
When you try to upload, check the backend terminal for any error messages.

### 5. Verify URL Registration
The endpoint should be registered at: `/api/shipments/upload_csv/`

The router pattern is: `^shipments/upload_csv/$`

## Common Issues

1. **Server not restarted**: Most common cause - restart the server
2. **Wrong Python interpreter**: Make sure you're using the venv Python
3. **Port conflict**: Make sure port 8000 is available
4. **CORS issues**: Check browser console for CORS errors

## Quick Test

Run this in PowerShell to test if the endpoint exists:
```powershell
curl http://localhost:8000/api/shipments/upload_csv/
```

If you get a response (even an error), the endpoint exists. If you get "could not connect", the server isn't running.
