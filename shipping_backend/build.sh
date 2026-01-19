#!/bin/bash
# Build script for deployment
set -e

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Seeding initial data..."
python manage.py seed_data || echo "Seed data already exists, skipping..."

echo "Build complete!"
