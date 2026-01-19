# Quick Start Guide

## Prerequisites Check

Make sure you have:
- Python 3.11+ installed
- Node.js 14+ and npm installed

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to project root
cd "C:\Users\HP\Downloads\New folder"

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Navigate to backend
cd shipping_backend

# Run migrations (if not already done)
python manage.py migrate

# Seed initial data
python manage.py seed_data

# Start server
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd "C:\Users\HP\Downloads\New folder\shipping-frontend"

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

Frontend will be available at: http://localhost:3000

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Click on "Upload Spreadsheet" in the sidebar
3. Upload the `Template.csv` file (drag & drop or browse)
4. Review and edit the imported data
5. Select shipping services
6. Complete the purchase flow

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
```

**Migration errors:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Seed data errors:**
- Check that migrations have been run
- Verify database connection

### Frontend Issues

**Port 3000 already in use:**
- The app will prompt to use a different port
- Or set PORT environment variable: `set PORT=3001 && npm start`

**API connection errors:**
- Verify backend is running on port 8000
- Check CORS settings in `shipping_backend/shipping_backend/settings.py`

**Module not found errors:**
```bash
npm install
```

## API Testing

You can test the API directly using curl or Postman:

```bash
# Get all shipments
curl http://localhost:8000/api/shipments/

# Get shipping services
curl http://localhost:8000/api/shipping-services/

# Get saved addresses
curl http://localhost:8000/api/saved-addresses/
```

## Next Steps

- Review the README.md for detailed documentation
- Check ASSESSMENT.md and PRD.md for requirements
- Customize the application as needed
