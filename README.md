# Bulk Shipping Label Creation Platform

A full-stack web application for creating shipping labels in bulk from CSV files. Built with Django REST Framework (backend) and React + TypeScript (frontend).

## 🚀 Features

- **3-Step Wizard Flow**: Upload → Review & Edit → Select Shipping → Purchase
- **CSV Upload**: Drag-and-drop or browse to upload CSV files with shipping data
- **Data Validation**: Automatic validation of addresses and package information
- **Bulk Operations**: Edit, delete, and update multiple shipments at once
- **Saved Addresses & Packages**: Quick reuse of frequently used addresses and package presets
- **Shipping Service Selection**: Choose between Priority Mail and Ground Shipping
- **Real-time Price Calculation**: Dynamic pricing based on package weight and selected service
- **Modern UI/UX**: Clean, professional interface with loading states and error handling

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **Django 5.2.10**
- **Django REST Framework 3.16.1**
- **SQLite** (can be configured for PostgreSQL)
- **django-cors-headers** for CORS support

### Frontend
- **React 18**
- **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 14+ and npm
- PostgreSQL (optional, SQLite used by default)

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd shipping_backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Seed initial data (saved addresses, packages, shipping services):**
   ```bash
   python manage.py seed_data
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd shipping-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
.
├── shipping_backend/          # Django backend
│   ├── shipping/              # Main app
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   ├── services.py       # Business logic (CSV parsing, address validation)
│   │   └── urls.py           # URL routing
│   └── shipping_backend/      # Django project settings
├── shipping-frontend/         # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Layout/       # Sidebar, Header, Layout
│   │   │   ├── Steps/        # Step 1, 2, 3, Purchase, Success
│   │   │   └── Modals/       # Edit modals
│   │   ├── services/         # API service layer
│   │   └── types.ts          # TypeScript types
│   └── public/               # Static files
├── Template.csv              # Sample CSV template
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🔌 API Endpoints

### Shipments
- `GET /api/shipments/` - List all shipments
- `POST /api/shipments/` - Create shipment
- `GET /api/shipments/{id}/` - Get shipment details
- `PATCH /api/shipments/{id}/` - Update shipment
- `DELETE /api/shipments/{id}/` - Delete shipment
- `POST /api/shipments/upload_csv/` - Upload CSV file
- `POST /api/shipments/bulk_update/` - Bulk update shipments
- `POST /api/shipments/bulk_delete/` - Bulk delete shipments
- `POST /api/shipments/bulk_update_shipping_service/` - Bulk update shipping service
- `GET /api/shipments/total_price/` - Get total price

### Addresses
- `GET /api/addresses/` - List addresses
- `POST /api/addresses/` - Create address
- `PATCH /api/addresses/{id}/` - Update address
- `DELETE /api/addresses/{id}/` - Delete address

### Packages
- `GET /api/packages/` - List packages
- `POST /api/packages/` - Create package
- `PATCH /api/packages/{id}/` - Update package
- `DELETE /api/packages/{id}/` - Delete package

### Shipping Services
- `GET /api/shipping-services/` - List shipping services

### Saved Addresses & Packages
- `GET /api/saved-addresses/` - List saved addresses
- `POST /api/saved-addresses/` - Create saved address
- `GET /api/saved-packages/` - List saved packages
- `POST /api/saved-packages/` - Create saved package

## 📊 CSV Format

The CSV file should follow this structure:

**Row 1:** Header categories
**Row 2:** Column names
**Row 3+:** Data rows

**Column Mapping:**
- Columns 0-6: Ship From (first_name, last_name, address, address2, city, zip, state)
- Columns 7-13: Ship To (first_name, last_name, address, address2, city, zip, state)
- Columns 14-18: Package (weight_lbs, weight_oz, length, width, height)
- Column 19-20: Phone numbers
- Column 21: Order number
- Column 22: Item SKU

See `Template.csv` for a complete example.

## 🎨 Design Decisions & Assumptions

### Validation Rules
- **Required Ship To fields**: First name, address line 1, city, ZIP code, state
- **Ship From**: Optional (can be empty)
- **Package dimensions**: Required (defaults to 0 if missing)
- **Weight**: Required (defaults to 0 if missing)

### Address Validation
- Implemented with fallback mechanism (USPS → SmartyStreets)
- Currently uses basic validation (checks for required fields)
- In production, integrate actual API keys for real validation

### Shipping Pricing
- Base price + (weight in oz × per_oz_rate)
- Priority Mail: $5.00 base + $0.10 per oz
- Ground Shipping: $2.50 base + $0.05 per oz

### State Management
- React state for wizard flow
- API calls for data persistence
- No Redux (kept simple for this assessment)

### Error Handling
- User-friendly error messages
- Logging for debugging
- Graceful fallbacks for API failures

## 🧪 Testing

### Manual Testing Checklist
- [x] CSV upload with valid data
- [x] CSV upload with missing data
- [x] Edit address (ship from/to)
- [x] Edit package details
- [x] Bulk operations (delete, update address, update package)
- [x] Shipping service selection
- [x] Price calculation
- [x] Purchase flow
- [x] Navigation between steps

## 📝 Logging

Structured logging is implemented throughout the application:
- CSV parsing operations
- Address validation
- Bulk operations
- API requests/responses

Logs are written to:
- Console (development)
- `shipping.log` file (backend)

## 🚢 Deployment

### Backend Deployment
1. Set `DEBUG = False` in `settings.py`
2. Configure `ALLOWED_HOSTS`
3. Set up PostgreSQL database
4. Run migrations: `python manage.py migrate`
5. Collect static files: `python manage.py collectstatic`
6. Use gunicorn or similar WSGI server

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve `build/` directory with nginx or similar
3. Configure API URL in environment variables

## 🔒 Security Considerations

- CORS configured for frontend origin only
- Input validation on backend
- SQL injection protection (Django ORM)
- XSS protection (React escapes by default)

## 📚 Future Enhancements

- User authentication and authorization
- Real address validation API integration
- PDF label generation
- Email notifications
- Order history tracking
- Advanced filtering and sorting
- Export functionality
- Multi-currency support

## 👤 Author

Built as a technical assessment for bulk shipping label creation platform.

## 📄 License

This project is proprietary and confidential.

---

**Note**: This is a demonstration application. For production use, implement proper authentication, error handling, and security measures.
