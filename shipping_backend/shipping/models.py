import logging
from django.db import models
from django.core.validators import MinValueValidator

logger = logging.getLogger("shipping")


class Address(models.Model):
    """Represents a shipping address (from or to)"""
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)  # US state abbreviation
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        verbose_name_plural = "Addresses"
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}, {self.city}, {self.state}"
    
    def formatted(self):
        """Return formatted address string"""
        lines = [
            f"{self.first_name} {self.last_name}".strip(),
            self.address_line1,
        ]
        if self.address_line2:
            lines.append(self.address_line2)
        lines.append(f"{self.city}, {self.state} {self.zip_code}")
        return "\n".join(lines)


class Package(models.Model):
    """Represents package dimensions and weight"""
    length = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    width = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    height = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    weight_lbs = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    weight_oz = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    item_sku = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.length}x{self.width}x{self.height} in, {self.weight_lbs}lb {self.weight_oz}oz"
    
    def total_weight_oz(self):
        """Calculate total weight in ounces"""
        return (self.weight_lbs * 16) + self.weight_oz


class SavedAddress(models.Model):
    """Saved addresses for quick reuse"""
    name = models.CharField(max_length=100)
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Saved Addresses"
    
    def __str__(self):
        return self.name


class SavedPackage(models.Model):
    """Saved package presets for quick reuse"""
    name = models.CharField(max_length=100)
    package = models.OneToOneField(Package, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Saved Packages"
    
    def __str__(self):
        return self.name


class ShippingService(models.Model):
    """Shipping service options"""
    SERVICE_CHOICES = [
        ("priority", "Priority Mail"),
        ("ground", "Ground Shipping"),
    ]
    
    name = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    per_oz_rate = models.DecimalField(max_digits=8, decimal_places=4, default=0.0)
    
    def __str__(self):
        return self.get_name_display()
    
    def calculate_price(self, package):
        """Calculate shipping price for a package"""
        total_weight_oz = package.total_weight_oz()
        return float(self.base_price) + (float(self.per_oz_rate) * total_weight_oz)


class Shipment(models.Model):
    """Main shipment record"""
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("validated", "Validated"),
        ("ready", "Ready to Ship"),
        ("purchased", "Purchased"),
    ]
    
    ship_from = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="shipments_from", null=True, blank=True)
    ship_to = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="shipments_to")
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    shipping_service = models.ForeignKey(ShippingService, on_delete=models.SET_NULL, null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Shipment #{self.id} - {self.order_number or 'No Order Number'}"
    
    def calculate_shipping_price(self):
        """Calculate shipping price based on selected service"""
        if self.shipping_service and self.package:
            price = self.shipping_service.calculate_price(self.package)
            self.shipping_price = price
            self.save()
            return price
        return None
