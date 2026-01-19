"""
Quick test script to check available URLs
Run with: python manage.py shell < test_urls.py
"""
from django.urls import get_resolver
from shipping.urls import router

print("Available shipment URLs:")
for url in router.urls:
    if 'shipment' in str(url.pattern):
        print(f"  {url.pattern} - {url.name}")
