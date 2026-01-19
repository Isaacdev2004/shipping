import logging
from rest_framework import serializers
from .models import Address, Package, SavedAddress, SavedPackage, ShippingService, Shipment

logger = logging.getLogger("shipping")


class AddressSerializer(serializers.ModelSerializer):
    formatted = serializers.CharField(read_only=True)
    
    class Meta:
        model = Address
        fields = ["id", "first_name", "last_name", "address_line1", "address_line2", 
                 "city", "state", "zip_code", "phone", "formatted"]


class PackageSerializer(serializers.ModelSerializer):
    total_weight_oz = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Package
        fields = ["id", "length", "width", "height", "weight_lbs", "weight_oz", 
                 "item_sku", "total_weight_oz"]


class SavedAddressSerializer(serializers.ModelSerializer):
    address = AddressSerializer(read_only=True)
    address_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = SavedAddress
        fields = ["id", "name", "address", "address_id", "created_at"]


class SavedPackageSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    package_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = SavedPackage
        fields = ["id", "name", "package", "package_id", "created_at"]


class ShippingServiceSerializer(serializers.ModelSerializer):
    name_display = serializers.CharField(source="get_name_display", read_only=True)
    
    class Meta:
        model = ShippingService
        fields = ["id", "name", "name_display", "base_price", "per_oz_rate"]


class ShipmentSerializer(serializers.ModelSerializer):
    ship_from = AddressSerializer(read_only=True)
    ship_from_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    ship_to = AddressSerializer(read_only=True)
    ship_to_id = serializers.IntegerField(write_only=True, required=False)
    package = PackageSerializer(read_only=True)
    package_id = serializers.IntegerField(write_only=True, required=False)
    shipping_service = ShippingServiceSerializer(read_only=True)
    shipping_service_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    
    class Meta:
        model = Shipment
        fields = [
            "id", "ship_from", "ship_from_id", "ship_to", "ship_to_id",
            "package", "package_id", "order_number", "status", "status_display",
            "shipping_service", "shipping_service_id", "shipping_price",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at", "shipping_price"]
    
    def create(self, validated_data):
        """Create shipment with related objects"""
        ship_from_id = validated_data.pop("ship_from_id", None)
        ship_to_id = validated_data.pop("ship_to_id", None)
        package_id = validated_data.pop("package_id", None)
        shipping_service_id = validated_data.pop("shipping_service_id", None)
        
        if ship_from_id:
            validated_data["ship_from_id"] = ship_from_id
        if ship_to_id:
            validated_data["ship_to_id"] = ship_to_id
        if package_id:
            validated_data["package_id"] = package_id
        if shipping_service_id:
            validated_data["shipping_service_id"] = shipping_service_id
        
        shipment = Shipment.objects.create(**validated_data)
        logger.info(f"Created shipment {shipment.id}")
        return shipment
    
    def update(self, instance, validated_data):
        """Update shipment with related objects"""
        ship_from_id = validated_data.pop("ship_from_id", None)
        ship_to_id = validated_data.pop("ship_to_id", None)
        package_id = validated_data.pop("package_id", None)
        shipping_service_id = validated_data.pop("shipping_service_id", None)
        
        if ship_from_id is not None:
            instance.ship_from_id = ship_from_id
        if ship_to_id is not None:
            instance.ship_to_id = ship_to_id
        if package_id is not None:
            instance.package_id = package_id
        if shipping_service_id is not None:
            instance.shipping_service_id = shipping_service_id
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        logger.info(f"Updated shipment {instance.id}")
        return instance


class BulkShipmentCreateSerializer(serializers.Serializer):
    """Serializer for bulk shipment creation from CSV"""
    shipments = ShipmentSerializer(many=True)
    
    def create(self, validated_data):
        shipments_data = validated_data["shipments"]
        created_shipments = []
        
        for shipment_data in shipments_data:
            shipment = Shipment.objects.create(**shipment_data)
            created_shipments.append(shipment)
        
        logger.info(f"Bulk created {len(created_shipments)} shipments")
        return {"shipments": created_shipments}
