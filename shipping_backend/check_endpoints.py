"""
Quick script to check if endpoints are registered
Run: python manage.py shell < check_endpoints.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shipping_backend.settings')
django.setup()

from django.urls import get_resolver
from shipping.urls import router

print("Checking shipment URLs:")
for url in router.urls:
    print(f"  Pattern: {url.pattern}")
    print(f"  Name: {url.name}")
    print(f"  Callback: {url.callback}")
    print("---")

# Check if upload_csv is in the URLs
resolver = get_resolver()
url_patterns = resolver.url_patterns
print("\nAll URL patterns:")
for pattern in url_patterns:
    print(f"  {pattern}")
