import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// GHN Configuration
const GHN_API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api';
const GHN_TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN;
const GHN_SHOP_ID = process.env.NEXT_PUBLIC_GHN_SHOP_ID;
const GHN_FROM_DISTRICT_ID = process.env.NEXT_PUBLIC_GHN_FROM_DISTRICT_ID;
const GHN_PRODUCT_TOKEN = process.env.NEXT_PUBLIC_GHN_PRODUCT_TOKEN;

// GHN API Types
export interface GHNProvince {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPC: number;
  UpdatedBy: number;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface GHNDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface GHNWard {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface GHNShippingFeeRequest {
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  insurance_value?: number;
  service_type_id?: number;
}

export interface GHNShippingFeeResponse {
  code: number;
  message: string;
  data: {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    coupon_value: number;
    r2s_fee: number;
  };
}

// GHN API Headers
const getGHNHeaders = () => ({
  'Content-Type': 'application/json',
  'Token': GHN_TOKEN || '',
  'ShopId': GHN_SHOP_ID || ''
});

// GHN Product API Headers (for product-related endpoints)
const getGHNProductHeaders = () => ({
  'Content-Type': 'application/json',
  'Token': GHN_PRODUCT_TOKEN || GHN_TOKEN || '',
  'ShopId': GHN_SHOP_ID || ''
});

// GHN API Service
export const ghnApi = {
  // Get all provinces
  getProvinces: async (): Promise<ApiResponse<GHNProvince[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/master-data/province`, {
        method: 'GET',
        headers: getGHNHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch provinces');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Provinces fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch provinces'
      };
    }
  },

  // Get districts by province ID
  getDistricts: async (provinceId: number): Promise<ApiResponse<GHNDistrict[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/master-data/district?province_id=${provinceId}`, {
        method: 'GET',
        headers: getGHNHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch districts');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Districts fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching districts:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch districts'
      };
    }
  },

  // Get wards by district ID
  getWards: async (districtId: number): Promise<ApiResponse<GHNWard[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/master-data/ward?district_id=${districtId}`, {
        method: 'GET',
        headers: getGHNHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch wards');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Wards fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching wards:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch wards'
      };
    }
  },

  // Calculate shipping fee
  calculateShippingFee: async (request: GHNShippingFeeRequest): Promise<ApiResponse<number>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/v2/shipping-order/fee`, {
        method: 'POST',
        headers: getGHNHeaders(),
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GHNShippingFeeResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to calculate shipping fee');
      }
      
      return {
        success: true,
        data: data.data.total,
        message: 'Shipping fee calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to calculate shipping fee'
      };
    }
  },

  // Get available services for a route
  getAvailableServices: async (fromDistrictId: number, toDistrictId: number): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/v2/shipping-order/available-services`, {
        method: 'POST',
        headers: getGHNHeaders(),
        body: JSON.stringify({
          from_district_id: fromDistrictId,
          to_district_id: toDistrictId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch available services');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Available services fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching available services:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch available services'
      };
    }
  },

  // Product-related endpoints using product token
  // Get product categories
  getProductCategories: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/v2/product/categories`, {
        method: 'GET',
        headers: getGHNProductHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch product categories');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Product categories fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching product categories:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch product categories'
      };
    }
  },

  // Get product list
  getProducts: async (page: number = 1, limit: number = 20): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/v2/product/list?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getGHNProductHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Products fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  },

  // Create product
  createProduct: async (productData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${GHN_API_URL}/v2/product/create`, {
        method: 'POST',
        headers: getGHNProductHeaders(),
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to create product');
      }
      
      return {
        success: true,
        data: data.data,
        message: 'Product created successfully'
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to create product'
      };
    }
  }
};

export default ghnApi;
