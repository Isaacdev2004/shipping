#!/bin/bash
# Start script for production
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Seeding initial data..."
python manage.py seed_data || echo "Seed data already exists, skipping..."

echo "Starting server..."
exec gunicorn shipping_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000}
