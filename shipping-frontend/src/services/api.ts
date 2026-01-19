import axios from 'axios';
import { Shipment, Address, Package, ShippingService, SavedAddress, SavedPackage } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shipments API
export const shipmentsAPI = {
  getAll: () => api.get<Shipment[]>('/api/shipments/'),
  getById: (id: number) => api.get<Shipment>(`/api/shipments/${id}/`),
  create: (data: Partial<Shipment>) => api.post<Shipment>('/api/shipments/', data),
  update: (id: number, data: Partial<Shipment>) => api.patch<Shipment>(`/api/shipments/${id}/`, data),
  delete: (id: number) => api.delete(`/api/shipments/${id}/`),
  uploadCSV: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // Create a separate axios instance without default Content-Type for file uploads
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
    });
    // Don't set Content-Type - browser will set multipart/form-data with boundary automatically
    return uploadApi.post<{ shipments: Shipment[]; count: number; errors: string[] }>(
      '/api/shipments/upload_csv/',
      formData
    );
  },
  bulkUpdate: (ids: number[], updates: Partial<Shipment>) =>
    api.post('/api/shipments/bulk_update/', { ids, updates }),
  bulkDelete: (ids: number[]) =>
    api.post('/api/shipments/bulk_delete/', { ids }),
  bulkUpdateShippingService: (ids: number[], serviceId?: number, option?: string) =>
    api.post('/api/shipments/bulk_update_shipping_service/', {
      ids,
      service_id: serviceId,
      option,
    }),
  getTotalPrice: () => api.get<{ total: number }>('/api/shipments/total_price/'),
  validateAddress: (id: number, type: 'from' | 'to') =>
    api.post(`/api/shipments/${id}/validate_address/`, { type }),
};

// Addresses API
export const addressesAPI = {
  getAll: () => api.get<Address[]>('/api/addresses/'),
  getById: (id: number) => api.get<Address>(`/api/addresses/${id}/`),
  create: (data: Partial<Address>) => api.post<Address>('/api/addresses/', data),
  update: (id: number, data: Partial<Address>) => api.patch<Address>(`/api/addresses/${id}/`, data),
  delete: (id: number) => api.delete(`/api/addresses/${id}/`),
};

// Packages API
export const packagesAPI = {
  getAll: () => api.get<Package[]>('/api/packages/'),
  getById: (id: number) => api.get<Package>(`/api/packages/${id}/`),
  create: (data: Partial<Package>) => api.post<Package>('/api/packages/', data),
  update: (id: number, data: Partial<Package>) => api.patch<Package>(`/api/packages/${id}/`, data),
  delete: (id: number) => api.delete(`/api/packages/${id}/`),
};

// Shipping Services API
export const shippingServicesAPI = {
  getAll: () => api.get<ShippingService[]>('/api/shipping-services/'),
  getById: (id: number) => api.get<ShippingService>(`/api/shipping-services/${id}/`),
};

// Saved Addresses API
export const savedAddressesAPI = {
  getAll: () => api.get<SavedAddress[]>('/api/saved-addresses/'),
  getById: (id: number) => api.get<SavedAddress>(`/api/saved-addresses/${id}/`),
  create: (data: Partial<SavedAddress>) => api.post<SavedAddress>('/api/saved-addresses/', data),
  delete: (id: number) => api.delete(`/api/saved-addresses/${id}/`),
};

// Saved Packages API
export const savedPackagesAPI = {
  getAll: () => api.get<SavedPackage[]>('/api/saved-packages/'),
  getById: (id: number) => api.get<SavedPackage>(`/api/saved-packages/${id}/`),
  create: (data: Partial<SavedPackage>) => api.post<SavedPackage>('/api/saved-packages/', data),
  delete: (id: number) => api.delete(`/api/saved-packages/${id}/`),
};

export default api;
