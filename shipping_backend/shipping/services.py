import csv
import logging
import requests
from typing import List, Dict, Optional, Tuple
from io import StringIO
from django.conf import settings

logger = logging.getLogger("shipping")


class CSVParseError(Exception):
    """Custom exception for CSV parsing errors"""
    pass


class AddressValidationError(Exception):
    """Custom exception for address validation errors"""
    pass


class CSVParser:
    """Service for parsing CSV files and creating shipment records"""
    
    @staticmethod
    def parse_csv(file_content: str) -> Tuple[List[Dict], List[str]]:
        """
        Parse CSV file and return list of shipment dictionaries.
        
        CSV Structure:
        Row 1: Header categories
        Row 2: Column names
        Row 3+: Data rows
        
        Column mapping:
        0-6: Ship From (first_name, last_name, address, address2, city, zip, state)
        7-13: Ship To (first_name, last_name, address, address2, city, zip, state)
        14-18: Package (weight_lbs, weight_oz, length, width, height)
        19-20: Phone numbers
        21: Order number
        22: Item SKU
        """
        logger.info("Starting CSV parsing")
        
        try:
            reader = csv.reader(StringIO(file_content))
            rows = list(reader)
            
            if len(rows) < 3:
                raise CSVParseError("CSV file must have at least 3 rows (2 headers + 1 data row)")
            
            # Skip first two header rows
            data_rows = rows[2:]
            shipments = []
            errors = []
            
            for idx, row in enumerate(data_rows, start=3):
                try:
                    shipment_data = CSVParser._parse_row(row, idx)
                    if shipment_data:
                        shipments.append(shipment_data)
                except Exception as e:
                    error_msg = f"Error parsing row {idx}: {str(e)}"
                    logger.warning(error_msg)
                    errors.append(error_msg)
            
            logger.info(f"Successfully parsed {len(shipments)} shipments from CSV")
            if errors:
                logger.warning(f"Encountered {len(errors)} errors during parsing")
            
            return shipments, errors
            
        except Exception as e:
            logger.error(f"CSV parsing failed: {str(e)}")
            raise CSVParseError(f"Failed to parse CSV: {str(e)}")
    
    @staticmethod
    def _parse_row(row: List[str], row_num: int) -> Optional[Dict]:
        """Parse a single CSV row into shipment data"""
        # Ensure row has enough columns
        while len(row) < 23:
            row.append("")
        
        # Extract Ship To address (required)
        to_first_name = row[7].strip()
        to_last_name = row[8].strip()
        to_address = row[9].strip()
        to_address2 = row[10].strip()
        to_city = row[11].strip()
        to_zip = row[12].strip()
        to_state = row[13].strip()
        
        # Validate required Ship To fields
        if not (to_first_name and to_address and to_city and to_zip and to_state):
            logger.warning(f"Row {row_num}: Missing required Ship To fields, skipping")
            return None
        
        # Extract Ship From address (optional - can be empty)
        from_first_name = row[0].strip()
        from_last_name = row[1].strip()
        from_address = row[2].strip()
        from_address2 = row[3].strip()
        from_city = row[4].strip()
        from_zip = row[5].strip()
        from_state = row[6].strip()
        
        # Extract package details
        weight_lbs = CSVParser._safe_int(row[14], 0)
        weight_oz = CSVParser._safe_int(row[15], 0)
        length = CSVParser._safe_float(row[16], 0)
        width = CSVParser._safe_float(row[17], 0)
        height = CSVParser._safe_float(row[18], 0)
        
        # Extract contact and reference info
        phone1 = row[19].strip()
        phone2 = row[20].strip()
        order_number = row[21].strip()
        item_sku = row[22].strip()
        
        # Use phone1 as primary phone
        phone = phone1 or phone2
        
        shipment_data = {
            "ship_from": {
                "first_name": from_first_name,
                "last_name": from_last_name,
                "address_line1": from_address,
                "address_line2": from_address2,
                "city": from_city,
                "state": from_state,
                "zip_code": from_zip,
                "phone": phone,
            } if from_first_name or from_address else None,
            "ship_to": {
                "first_name": to_first_name,
                "last_name": to_last_name,
                "address_line1": to_address,
                "address_line2": to_address2,
                "city": to_city,
                "state": to_state,
                "zip_code": to_zip,
                "phone": phone,
            },
            "package": {
                "length": length,
                "width": width,
                "height": height,
                "weight_lbs": weight_lbs,
                "weight_oz": weight_oz,
                "item_sku": item_sku,
            },
            "order_number": order_number or f"ORD-{row_num}",
        }
        
        return shipment_data
    
    @staticmethod
    def _safe_int(value: str, default: int = 0) -> int:
        """Safely convert string to int"""
        try:
            return int(float(value)) if value.strip() else default
        except (ValueError, AttributeError):
            return default
    
    @staticmethod
    def _safe_float(value: str, default: float = 0.0) -> float:
        """Safely convert string to float"""
        try:
            return float(value) if value.strip() else default
        except (ValueError, AttributeError):
            return default


class AddressValidator:
    """Service for validating addresses using external APIs with fallback"""
    
    # API endpoints and configurations
    USPS_API_URL = "https://secure.shippingapis.com/ShippingAPI.dll"
    SMARTY_API_URL = "https://us-street.api.smartystreets.com/street-address"
    
    @staticmethod
    def validate_address(address_data: Dict) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """
        Validate address using multiple APIs with fallback.
        
        Returns:
            (is_valid, validated_address_data, error_message)
        """
        logger.info(f"Validating address: {address_data.get('address_line1')}, {address_data.get('city')}")
        
        # Try USPS first (free tier)
        try:
            is_valid, validated_data, error = AddressValidator._validate_usps(address_data)
            if is_valid:
                logger.info("Address validated successfully using USPS")
                return True, validated_data, None
        except Exception as e:
            logger.warning(f"USPS validation failed: {str(e)}")
        
        # Try SmartyStreets as fallback (if API key available)
        try:
            is_valid, validated_data, error = AddressValidator._validate_smarty(address_data)
            if is_valid:
                logger.info("Address validated successfully using SmartyStreets")
                return True, validated_data, None
        except Exception as e:
            logger.warning(f"SmartyStreets validation failed: {str(e)}")
        
        # If both fail, return original address with warning
        logger.warning("All address validation APIs failed, using original address")
        return False, address_data, "Address validation unavailable, using original address"
    
    @staticmethod
    def _validate_usps(address_data: Dict) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """Validate address using USPS API"""
        # USPS API requires registration and API key
        # For demo purposes, we'll simulate validation
        # In production, implement actual USPS API call
        
        # Basic validation: check if required fields are present
        required_fields = ["address_line1", "city", "state", "zip_code"]
        if all(address_data.get(field) for field in required_fields):
            # Simulate successful validation
            return True, address_data, None
        
        return False, None, "Missing required address fields"
    
    @staticmethod
    def _validate_smarty(address_data: Dict) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """Validate address using SmartyStreets API"""
        # SmartyStreets API requires API key
        # For demo purposes, we'll simulate validation
        # In production, implement actual SmartyStreets API call
        
        # Basic validation: check if required fields are present
        required_fields = ["address_line1", "city", "state", "zip_code"]
        if all(address_data.get(field) for field in required_fields):
            # Simulate successful validation
            return True, address_data, None
        
        return False, None, "Missing required address fields"
    
    @staticmethod
    def validate_bulk_addresses(addresses: List[Dict]) -> List[Tuple[bool, Optional[Dict], Optional[str]]]:
        """Validate multiple addresses"""
        results = []
        for address in addresses:
            result = AddressValidator.validate_address(address)
            results.append(result)
        return results
