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

export interface GHNShippingFeeItem {
  name: string;
  quantity: number;
  height?: number;
  weight?: number;
  length?: number;
  width?: number;
}

export interface GHNShippingFeeRequest {
  from_district_id?: number;        // District ID pick up parcels (optional if using shopId)
  from_ward_code?: string;          // Ward code pick up parcels (optional if using shopId)
  to_district_id: number;           // District ID drop off parcels (required)
  to_ward_code: string;             // Ward Code drop off parcels (required)
  service_id?: number;              // Service ID from API SERVICE
  service_type_id?: number;         // Default: 2 (E-Commerce Delivery)
  height?: number;                  // Height (cm)
  length?: number;                  // Length (cm)
  weight?: number;                  // Weight (gram)
  width?: number;                   // Width (cm)
  insurance_value?: number;         // Parcel value for compensation (max 5,000,000)
  cod_value?: number;               // Amount cash to collect (max 5,000,000)
  cod_failed_amount?: number;       // Value of collect money when delivery fail
  coupon?: string | null;           // Coupon Code for discount
  items?: GHNShippingFeeItem[];     // List of items in the parcel
}

export interface GHNShippingFeeData {
  total: number;                    // Total service fee
  service_fee: number;              // Service fee
  insurance_fee: number;            // Insurance fee
  pick_station_fee: number;         // Pickup fee at Station
  coupon_value: number;             // Coupon discount value
  r2s_fee: number;                  // Fee of delivery parcel again
  document_return: number;          // Fee of document return
  double_check: number;             // Fee of check together
  cod_fee: number;                  // Fee of collection COD
  pick_remote_areas_fee: number;    // Fee of pick remote areas
  deliver_remote_areas_fee: number; // Fee of delivery remote areas
  cod_failed_fee: number;           // Fee of collection money when delivery fail
}

export interface GHNShippingFeeResponse {
  code: number;
  message: string;
  data: GHNShippingFeeData;
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
  calculateShippingFee: async (request: GHNShippingFeeRequest): Promise<ApiResponse<GHNShippingFeeData>> => {
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
        data: data.data,
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

  // Calculate shipping fee (returns only total - for backward compatibility)
  calculateShippingFeeTotal: async (request: GHNShippingFeeRequest): Promise<ApiResponse<number>> => {
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

      const normalizeEvents = (data: { data?: unknown; code?: number }): GHNTrackingEvent[] => {
        const dataObj = data?.data as { logs?: unknown[]; log?: unknown[] } | unknown[] | undefined;
        const logs: unknown[] = Array.isArray(dataObj)
          ? dataObj
          : (Array.isArray((dataObj as { logs?: unknown[] })?.logs) ? (dataObj as { logs: unknown[] }).logs : (Array.isArray((dataObj as { log?: unknown[] })?.log) ? (dataObj as { log: unknown[] }).log : []));
        const events: GHNTrackingEvent[] = logs.map((e: unknown) => {
          const event = e as { time?: string; created_at?: string; createdAt?: string; updated_date?: string; status?: string; current_status?: string; action?: string; reason_code?: string; reason?: string; note?: string; description?: string; location?: string; hub?: string; current_region?: string };
          return {
            time: event.time || event.created_at || event.createdAt || event.updated_date || '',
            status: event.status || event.current_status || event.action || event.reason_code || 'UNKNOWN',
            reason: event.reason || event.note || event.description || null,
            location: event.location || event.hub || event.current_region || null,
          };
        });
        if (events.length === 0 && data?.data) {
          // Synthesize an initial event from detail payload when logs are not available yet
          const d = data.data as { updated_date?: string; created_date?: string; status?: string; content?: string; note?: string; current_warehouse_id?: number };
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
      let data: { code?: number; message?: string; data?: unknown } | null = null;
      if (response.ok) {
        data = await response.json() as { code?: number; message?: string; data?: unknown };
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
      };

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
  getAvailableServices: async (fromDistrictId: number, toDistrictId: number): Promise<ApiResponse<unknown[]>> => {
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
  getProductCategories: async (): Promise<ApiResponse<unknown[]>> => {
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
  getProducts: async (page: number = 1, limit: number = 20): Promise<ApiResponse<unknown[]>> => {
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
  createProduct: async (productData: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
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
