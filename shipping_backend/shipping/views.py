import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Address, Package, SavedAddress, SavedPackage, ShippingService, Shipment
from .serializers import (
    AddressSerializer, PackageSerializer, SavedAddressSerializer,
    SavedPackageSerializer, ShippingServiceSerializer, ShipmentSerializer
)
from .services import CSVParser, AddressValidator, CSVParseError

logger = logging.getLogger("shipping")


@api_view(['GET'])
def api_root(request):
    """Root endpoint that provides API information"""
    return Response({
        "name": "Shipping Label Creation API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "shipments": "/api/shipments/",
            "upload_csv": "/api/shipments/upload_csv/",
            "addresses": "/api/addresses/",
            "packages": "/api/packages/",
            "saved_addresses": "/api/saved-addresses/",
            "saved_packages": "/api/saved-packages/",
            "shipping_services": "/api/shipping-services/",
            "admin": "/admin/"
        }
    })


class AddressViewSet(viewsets.ModelViewSet):
    """ViewSet for Address model"""
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Creating new address")
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        logger.info(f"Updating address {kwargs.get('pk')}")
        return super().update(request, *args, **kwargs)


class PackageViewSet(viewsets.ModelViewSet):
    """ViewSet for Package model"""
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Creating new package")
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        logger.info(f"Updating package {kwargs.get('pk')}")
        return super().update(request, *args, **kwargs)


class SavedAddressViewSet(viewsets.ModelViewSet):
    """ViewSet for SavedAddress model"""
    queryset = SavedAddress.objects.all()
    serializer_class = SavedAddressSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Creating saved address")
        address_data = request.data.get("address", {})
        address_serializer = AddressSerializer(data=address_data)
        
        if address_serializer.is_valid():
            address = address_serializer.save()
            saved_address = SavedAddress.objects.create(
                name=request.data.get("name"),
                address=address
            )
            serializer = self.get_serializer(saved_address)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(address_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SavedPackageViewSet(viewsets.ModelViewSet):
    """ViewSet for SavedPackage model"""
    queryset = SavedPackage.objects.all()
    serializer_class = SavedPackageSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Creating saved package")
        package_data = request.data.get("package", {})
        package_serializer = PackageSerializer(data=package_data)
        
        if package_serializer.is_valid():
            package = package_serializer.save()
            saved_package = SavedPackage.objects.create(
                name=request.data.get("name"),
                package=package
            )
            serializer = self.get_serializer(saved_package)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(package_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShippingServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ShippingService model (read-only)"""
    queryset = ShippingService.objects.all()
    serializer_class = ShippingServiceSerializer


class ShipmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Shipment model"""
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Creating new shipment")
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        logger.info(f"Updating shipment {kwargs.get('pk')}")
        instance = self.get_object()
        
        # If shipping service is updated, recalculate price
        if "shipping_service_id" in request.data:
            instance.shipping_service_id = request.data["shipping_service_id"]
            instance.calculate_shipping_price()
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], parser_classes=[MultiPartParser, FormParser], url_path="upload_csv")
    def upload_csv(self, request):
        """Upload and parse CSV file"""
        logger.info("CSV upload requested")
        
        if "file" not in request.FILES:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES["file"]
        
        try:
            # Read file content - try different encodings
            try:
                file_content = file.read().decode("utf-8")
            except UnicodeDecodeError:
                try:
                    file.seek(0)  # Reset file pointer
                    file_content = file.read().decode("utf-8-sig")  # Handle BOM
                except UnicodeDecodeError:
                    file.seek(0)
                    file_content = file.read().decode("latin-1")  # Fallback encoding
            
            logger.info(f"CSV file read successfully, size: {len(file_content)} bytes")
            
            # Parse CSV
            parser = CSVParser()
            shipments_data, errors = parser.parse_csv(file_content)
            
            if not shipments_data:
                return Response(
                    {"error": "No valid shipments found in CSV", "errors": errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create shipments
            created_shipments = []
            creation_errors = []
            
            with transaction.atomic():
                for idx, shipment_data in enumerate(shipments_data):
                    try:
                        # Create or get addresses
                        ship_to_data = shipment_data["ship_to"]
                        
                        # Check if ship_to address already exists
                        ship_to = Address.objects.filter(
                            address_line1=ship_to_data["address_line1"],
                            city=ship_to_data["city"],
                            zip_code=ship_to_data["zip_code"]
                        ).first()
                        
                        if not ship_to:
                            ship_to = Address.objects.create(**ship_to_data)
                        else:
                            # Update existing address with new data
                            for key, value in ship_to_data.items():
                                setattr(ship_to, key, value)
                            ship_to.save()
                        
                        ship_from = None
                        if shipment_data.get("ship_from") and shipment_data["ship_from"].get("address_line1"):
                            ship_from_data = shipment_data["ship_from"]
                            
                            # Check if ship_from address already exists
                            ship_from = Address.objects.filter(
                                address_line1=ship_from_data["address_line1"],
                                city=ship_from_data["city"],
                                zip_code=ship_from_data["zip_code"]
                            ).first()
                            
                            if not ship_from:
                                ship_from = Address.objects.create(**ship_from_data)
                            else:
                                # Update existing address with new data
                                for key, value in ship_from_data.items():
                                    setattr(ship_from, key, value)
                                ship_from.save()
                        
                        # Create package
                        package_data = shipment_data["package"]
                        package = Package.objects.create(**package_data)
                        
                        # Create shipment
                        shipment = Shipment.objects.create(
                            ship_from=ship_from,
                            ship_to=ship_to,
                            package=package,
                            order_number=shipment_data["order_number"],
                            status="pending"
                        )
                        created_shipments.append(shipment)
                        
                    except Exception as e:
                        error_msg = f"Error creating shipment {idx + 1}: {str(e)}"
                        logger.error(error_msg)
                        creation_errors.append(error_msg)
                        continue
            
            logger.info(f"Successfully created {len(created_shipments)} shipments from CSV")
            
            if not created_shipments:
                return Response(
                    {"error": "Failed to create any shipments", "errors": errors + creation_errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = ShipmentSerializer(created_shipments, many=True)
            return Response({
                "shipments": serializer.data,
                "count": len(created_shipments),
                "errors": errors + creation_errors
            }, status=status.HTTP_201_CREATED)
            
        except CSVParseError as e:
            logger.error(f"CSV parsing error: {str(e)}")
            return Response(
                {"error": f"CSV parsing failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"CSV upload failed: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Upload failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=["post"])
    def validate_address(self, request, pk=None):
        """Validate address for a shipment"""
        shipment = self.get_object()
        address_type = request.data.get("type", "to")  # "from" or "to"
        
        logger.info(f"Validating {address_type} address for shipment {pk}")
        
        address = shipment.ship_from if address_type == "from" else shipment.ship_to
        if not address:
            return Response(
                {"error": f"Ship {address_type} address not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        address_data = AddressSerializer(address).data
        is_valid, validated_data, error = AddressValidator.validate_address(address_data)
        
        if is_valid:
            # Update address with validated data
            for key, value in validated_data.items():
                if key != "id" and hasattr(address, key):
                    setattr(address, key, value)
            address.save()
            shipment.status = "validated"
            shipment.save()
        
        return Response({
            "is_valid": is_valid,
            "validated_address": AddressSerializer(address).data if is_valid else None,
            "error": error
        })
    
    @action(detail=False, methods=["post"])
    def bulk_update(self, request):
        """Bulk update shipments"""
        shipment_ids = request.data.get("ids", [])
        updates = request.data.get("updates", {})
        
        logger.info(f"Bulk updating {len(shipment_ids)} shipments")
        
        shipments = Shipment.objects.filter(id__in=shipment_ids)
        updated_count = 0
        
        with transaction.atomic():
            for shipment in shipments:
                for key, value in updates.items():
                    if hasattr(shipment, key):
                        setattr(shipment, key, value)
                shipment.save()
                updated_count += 1
        
        logger.info(f"Successfully updated {updated_count} shipments")
        return Response({"updated": updated_count})
    
    @action(detail=False, methods=["post"])
    def bulk_delete(self, request):
        """Bulk delete shipments"""
        shipment_ids = request.data.get("ids", [])
        
        logger.info(f"Bulk deleting {len(shipment_ids)} shipments")
        
        deleted_count, _ = Shipment.objects.filter(id__in=shipment_ids).delete()
        
        logger.info(f"Successfully deleted {deleted_count} shipments")
        return Response({"deleted": deleted_count})
    
    @action(detail=False, methods=["post"])
    def bulk_update_shipping_service(self, request):
        """Bulk update shipping service for selected shipments"""
        shipment_ids = request.data.get("ids", [])
        service_id = request.data.get("service_id")
        service_option = request.data.get("option")  # "cheapest", "priority", "ground"
        
        logger.info(f"Bulk updating shipping service for {len(shipment_ids)} shipments")
        
        if service_option == "cheapest":
            # Get cheapest service
            services = ShippingService.objects.all()
            cheapest_service = min(services, key=lambda s: float(s.base_price))
            service_id = cheapest_service.id
        elif service_option == "priority":
            service = ShippingService.objects.filter(name="priority").first()
            service_id = service.id if service else None
        elif service_option == "ground":
            service = ShippingService.objects.filter(name="ground").first()
            service_id = service.id if service else None
        
        if not service_id:
            return Response(
                {"error": "Invalid service option"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        shipments = Shipment.objects.filter(id__in=shipment_ids)
        updated_count = 0
        
        with transaction.atomic():
            for shipment in shipments:
                shipment.shipping_service_id = service_id
                shipment.calculate_shipping_price()
                updated_count += 1
        
        logger.info(f"Successfully updated shipping service for {updated_count} shipments")
        return Response({"updated": updated_count})
    
    @action(detail=False, methods=["get"])
    def total_price(self, request):
        """Calculate total price for all shipments"""
        shipments = Shipment.objects.filter(shipping_price__isnull=False)
        total = sum(float(s.shipping_price) for s in shipments)
        
        logger.info(f"Calculated total price: ${total:.2f}")
        return Response({"total": round(total, 2)})
