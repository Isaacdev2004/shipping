from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    api_root, AddressViewSet, PackageViewSet, SavedAddressViewSet,
    SavedPackageViewSet, ShippingServiceViewSet, ShipmentViewSet
)

router = DefaultRouter()
router.register(r"addresses", AddressViewSet)
router.register(r"packages", PackageViewSet)
router.register(r"saved-addresses", SavedAddressViewSet)
router.register(r"saved-packages", SavedPackageViewSet)
router.register(r"shipping-services", ShippingServiceViewSet)
router.register(r"shipments", ShipmentViewSet)

urlpatterns = [
    path("", api_root, name="api-root"),
    path("api/", include(router.urls)),
]
