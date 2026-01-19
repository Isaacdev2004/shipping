export interface Address {
  id?: number;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  formatted?: string;
}

export interface Package {
  id?: number;
  length: number;
  width: number;
  height: number;
  weight_lbs: number;
  weight_oz: number;
  item_sku: string;
  total_weight_oz?: number;
}

export interface ShippingService {
  id: number;
  name: string;
  name_display: string;
  base_price: string;
  per_oz_rate: string;
}

export interface Shipment {
  id: number;
  ship_from: Address | null;
  ship_to: Address;
  package: Package;
  order_number: string;
  status: string;
  status_display: string;
  shipping_service: ShippingService | null;
  shipping_price: string | null;
  created_at: string;
  updated_at: string;
  // Write-only fields for updates
  ship_from_id?: number | null;
  ship_to_id?: number;
  package_id?: number;
  shipping_service_id?: number | null;
}

export interface SavedAddress {
  id: number;
  name: string;
  address: Address;
  created_at: string;
}

export interface SavedPackage {
  id: number;
  name: string;
  package: Package;
  created_at: string;
}
