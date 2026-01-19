import logging
from django.core.management.base import BaseCommand
from shipping.models import Address, Package, SavedAddress, SavedPackage, ShippingService

logger = logging.getLogger("shipping")


class Command(BaseCommand):
    help = "Seed initial data (saved addresses, packages, shipping services)"

    def handle(self, *args, **options):
        logger.info("Seeding initial data")
        
        # Create saved addresses
        addresses_data = [
            {
                "name": "Print TTS - San Dimas",
                "address": {
                    "first_name": "Print TTS",
                    "last_name": "",
                    "address_line1": "502 W Arrow Hwy, STE P",
                    "address_line2": "",
                    "city": "San Dimas",
                    "state": "CA",
                    "zip_code": "91773",
                    "phone": "",
                }
            },
            {
                "name": "Print TTS - Claremont",
                "address": {
                    "first_name": "Print TTS",
                    "last_name": "",
                    "address_line1": "500 W Foothill Blvd, STE P",
                    "address_line2": "",
                    "city": "Claremont",
                    "state": "CA",
                    "zip_code": "91711",
                    "phone": "",
                }
            },
            {
                "name": "Print TTS - Ontario",
                "address": {
                    "first_name": "Print TTS",
                    "last_name": "",
                    "address_line1": "1170 Grove Ave",
                    "address_line2": "",
                    "city": "Ontario",
                    "state": "CA",
                    "zip_code": "91764",
                    "phone": "",
                }
            },
        ]
        
        for addr_data in addresses_data:
            address_obj, created = Address.objects.get_or_create(
                address_line1=addr_data["address"]["address_line1"],
                city=addr_data["address"]["city"],
                defaults=addr_data["address"]
            )
            saved_addr, created = SavedAddress.objects.get_or_create(
                name=addr_data["name"],
                defaults={"address": address_obj}
            )
            if created:
                logger.info(f"Created saved address: {addr_data['name']}")
        
        # Create saved packages
        packages_data = [
            {
                "name": "Light Package",
                "package": {
                    "length": 6,
                    "width": 6,
                    "height": 6,
                    "weight_lbs": 1,
                    "weight_oz": 0,
                    "item_sku": "",
                }
            },
            {
                "name": "8 Oz Item",
                "package": {
                    "length": 4,
                    "width": 4,
                    "height": 4,
                    "weight_lbs": 0,
                    "weight_oz": 8,
                    "item_sku": "",
                }
            },
            {
                "name": "Standard Box",
                "package": {
                    "length": 12,
                    "width": 12,
                    "height": 12,
                    "weight_lbs": 2,
                    "weight_oz": 0,
                    "item_sku": "",
                }
            },
        ]
        
        for pkg_data in packages_data:
            package_obj = Package.objects.create(**pkg_data["package"])
            saved_pkg, created = SavedPackage.objects.get_or_create(
                name=pkg_data["name"],
                defaults={"package": package_obj}
            )
            if created:
                logger.info(f"Created saved package: {pkg_data['name']}")
        
        # Create shipping services
        services_data = [
            {
                "name": "priority",
                "base_price": 5.00,
                "per_oz_rate": 0.10,
            },
            {
                "name": "ground",
                "base_price": 2.50,
                "per_oz_rate": 0.05,
            },
        ]
        
        for svc_data in services_data:
            service, created = ShippingService.objects.get_or_create(
                name=svc_data["name"],
                defaults=svc_data
            )
            if created:
                logger.info(f"Created shipping service: {svc_data['name']}")
        
        self.stdout.write(
            self.style.SUCCESS("Successfully seeded initial data")
        )
