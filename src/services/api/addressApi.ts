import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Address interface matching backend response
export interface Address {
  id?: number;
  userId?: number;
  fullName: string;
  phone: string;
  line: string;
  ward: string;
  city: string;
  countryCode: string;
  isDefault?: boolean;
  default?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Request interface for creating/updating addresses
export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  line: string;
  ward: string;
  city: string;
  countryCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: number;
}

// Address API service
export const addressApi = {
  // Get all addresses for the current user
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    try {
      const response = await apiClient.get<Address[]>('/addresses');
      return response;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch addresses',
      };
    }
  },

  // Get a specific address by ID
  getAddressById: async (id: number): Promise<ApiResponse<Address>> => {
    try {
      const response = await apiClient.get<Address>(`/addresses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching address:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch address',
      };
    }
  },

  // Create a new address
  createAddress: async (addressData: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    try {
      const response = await apiClient.post<Address>('/addresses', addressData);
      return response;
    } catch (error) {
      console.error('Error creating address:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to create address',
      };
    }
  },

  // Update an existing address
  updateAddress: async (addressData: UpdateAddressRequest): Promise<ApiResponse<Address>> => {
    try {
      const { id, ...updateData } = addressData;
      const response = await apiClient.put<Address>(`/addresses/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to update address',
      };
    }
  },

  // Delete an address
  deleteAddress: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<void>(`/addresses/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting address:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to delete address',
      };
    }
  },

  // Set default address
  setDefaultAddress: async (id: number): Promise<ApiResponse<Address>> => {
    try {
      const response = await apiClient.patch<Address>(`/addresses/${id}/default`);
      return response;
    } catch (error) {
      console.error('Error setting default address:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to set default address',
      };
    }
  },

  // Get default address
  getDefaultAddress: async (): Promise<Address | null> => {
    try {
      const response = await apiClient.get<Address[]>('/addresses');
      if (response.success && response.data) {
        const defaultAddress = response.data.find(addr => addr.isDefault || addr.default);
        return defaultAddress || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching default address:', error);
      return null;
    }
  },
};

export default addressApi;