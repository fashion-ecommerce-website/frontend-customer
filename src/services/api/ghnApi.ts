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

// Tracking types
export interface GHNTrackingEvent {
  time: string; // ISO-like string from GHN, leave as string
  status: string;
  reason?: string | null;
  location?: string | null;
}

// Create shipping order types (simplified)
export interface GHNCreateOrderRequest {
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string; // e.g., "20108"
  to_district_id: number; // e.g., 1442
  weight: number; // grams
  length?: number;
  width?: number;
  height?: number;
  service_type_id?: number; // e.g., 2
  payment_type_id?: 1 | 2; // 1: sender pays, 2: receiver pays
  cod_amount?: number;
  content?: string;
  required_note?: 'CHOTHUHANG' | 'CHOXEMHANGKHONGTHU' | 'KHONGCHOXEMHANG';
}

export interface GHNCreateOrderResponse {
  order_code: string;
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
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to calculate shipping fee'
      };
    }
  },

  // Track an order by GHN order_code (tracking number)
  trackOrder: async (orderCode: string): Promise<ApiResponse<GHNTrackingEvent[]>> => {
    try {
      // Primary endpoint
      const tryTrack = async () => {
        const res = await fetch(`${GHN_API_URL}/v2/shipping-order/track`, {
          method: 'POST',
          headers: getGHNHeaders(),
          body: JSON.stringify({ order_code: orderCode })
        });
        return res;
      };

      // Fallback endpoint: detail (some tenants expose logs here)
      const tryDetail = async () => {
        const res = await fetch(`${GHN_API_URL}/v2/shipping-order/detail`, {
          method: 'POST',
          headers: getGHNHeaders(),
          body: JSON.stringify({ order_code: orderCode })
        });
        return res;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizeEvents = (data: any): GHNTrackingEvent[] => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const logs: any[] = Array.isArray(data?.data)
          ? data.data
          : (Array.isArray(data?.data?.logs) ? data.data.logs : (Array.isArray(data?.data?.log) ? data.data.log : []));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events: GHNTrackingEvent[] = logs.map((e: any) => ({
          time: e.time || e.created_at || e.createdAt || e.updated_date || '',
          status: e.status || e.current_status || e.action || e.reason_code || 'UNKNOWN',
          reason: e.reason || e.note || e.description || null,
          location: e.location || e.hub || e.current_region || null,
        }));
        if (events.length === 0 && data?.data) {
          // Synthesize an initial event from detail payload when logs are not available yet
          const d = data.data;
          events.push({
            time: d.updated_date || d.created_date || new Date().toISOString(),
            status: d.status || 'CREATED',
            reason: d.content || d.note || null,
            location: (d.current_warehouse_id ? `WH-${d.current_warehouse_id}` : null),
          });
        }
        return events;
      };

      let response = await tryTrack();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data = null as any;
      if (response.ok) {
        data = await response.json();
        if (data?.code === 200) {
          return { success: true, data: normalizeEvents(data), message: 'Tracking events fetched successfully' };
        }
      }

      // If primary failed (404 or non-200), try detail
      response = await tryDetail();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data = await response.json();
      if (data?.code !== 200) {
        throw new Error(data?.message || 'Failed to track order');
      }
      return { success: true, data: normalizeEvents(data), message: 'Tracking events fetched successfully' };
    } catch (error) {
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to track order'
      };
    }
  },

  // Create shipping order on GHN to obtain order_code
  createShippingOrder: async (payload: GHNCreateOrderRequest): Promise<ApiResponse<GHNCreateOrderResponse>> => {
    try {
      const body = {
        // GHN v2 expects snake_case keys per docs
        to_name: payload.to_name,
        to_phone: payload.to_phone,
        to_address: payload.to_address,
        to_ward_code: payload.to_ward_code,
        to_district_id: payload.to_district_id,
        weight: payload.weight,
        length: payload.length || 10,
        width: payload.width || 10,
        height: payload.height || 10,
        service_type_id: payload.service_type_id || 2,
        payment_type_id: payload.payment_type_id || 2,
        cod_amount: payload.cod_amount || 0,
        content: payload.content || 'Order',
        required_note: payload.required_note || 'KHONGCHOXEMHANG',
        from_district_id: GHN_FROM_DISTRICT_ID ? Number(GHN_FROM_DISTRICT_ID) : undefined,
      } as unknown as Record<string, unknown>;

      const response = await fetch(`${GHN_API_URL}/v2/shipping-order/create`, {
        method: 'POST',
        headers: getGHNHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code !== 200) {
        throw new Error(data.message || 'Failed to create GHN order');
      }

      return {
        success: true,
        data: { order_code: data.data?.order_code },
        message: 'GHN order created successfully'
      };
    } catch (error) {
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to create GHN order'
      };
    }
  },

  // Get available services for a route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch available services'
      };
    }
  },

  // Product-related endpoints using product token
  // Get product categories
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch product categories'
      };
    }
  },

  // Get product list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  },

  // Create product
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to create product'
      };
    }
  }
};

export default ghnApi;
