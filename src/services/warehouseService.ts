import api from './api';
import { ApiResponse } from '../types';

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const warehouseService = {
  async getWarehouses(): Promise<ApiResponse<Warehouse[]>> {
    const response = await api.get('/inventory/warehouses');
    return response.data;
  },

  async getWarehouse(id: string): Promise<ApiResponse<Warehouse>> {
    const response = await api.get(`/inventory/warehouses/${id}`);
    return response.data;
  },

  async createWarehouse(warehouseData: Partial<Warehouse>): Promise<ApiResponse<Warehouse>> {
    const response = await api.post('/inventory/warehouses', warehouseData);
    return response.data;
  },

  async updateWarehouse(id: string, warehouseData: Partial<Warehouse>): Promise<ApiResponse<Warehouse>> {
    const response = await api.patch(`/inventory/warehouses/${id}`, warehouseData);
    return response.data;
  },

  async deleteWarehouse(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/inventory/warehouses/${id}`);
    return response.data;
  },
};

