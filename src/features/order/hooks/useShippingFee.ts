import { useState, useEffect, useMemo } from 'react';
import { ghnApi, GHNShippingFeeRequest, GHNShippingFeeData } from '@/services/api/ghnApi';
import { GHN_CONFIG } from '@/config/environment';

export interface AddressData {
  province?: string;
  district?: string;
  ward?: string;
  // GHN Integration fields
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
}

export interface ShippingFeeData {
  fee: number;
  isCalculating: boolean;
  error?: string;
  // Detailed fee breakdown from GHN
  details?: GHNShippingFeeData;
}

export interface ShippingFeeOptions {
  weight?: number;        // Weight in grams (if not provided, calculated from itemCount)
  height?: number;        // Height in cm
  length?: number;        // Length in cm
  width?: number;         // Width in cm
  insuranceValue?: number; // Insurance value
  codValue?: number;      // COD amount
  serviceTypeId?: number; // Service type (default: 2 - E-Commerce/Standard)
  itemCount?: number;     // Number of items (used to calculate weight if weight not provided)
}

// Calculate weight based on item count (matches Backend logic: 200g per item)
const calculateWeight = (options?: ShippingFeeOptions): number => {
  if (options?.weight) {
    return options.weight;
  }
  // Backend uses 200g per item, minimum 1 item
  const itemCount = options?.itemCount ?? 1;
  return itemCount * GHN_CONFIG.WEIGHT_PER_ITEM;
};

// GHN shipping fee calculation
const calculateShippingFeeFromGHN = async (
  address: AddressData, 
  options?: ShippingFeeOptions
): Promise<GHNShippingFeeData> => {
  // Check if we have GHN IDs for accurate calculation
  if (address.districtId && address.wardCode) {
    const fromDistrictId = parseInt(GHN_CONFIG.FROM_DISTRICT_ID || '0');
    
    const request: GHNShippingFeeRequest = {
      from_district_id: fromDistrictId > 0 ? fromDistrictId : undefined,
      to_district_id: address.districtId,
      to_ward_code: address.wardCode,
      height: options?.height ?? GHN_CONFIG.DEFAULT_PACKAGE.height,
      length: options?.length ?? GHN_CONFIG.DEFAULT_PACKAGE.length,
      weight: calculateWeight(options),
      width: options?.width ?? GHN_CONFIG.DEFAULT_PACKAGE.width,
      insurance_value: options?.insuranceValue ?? GHN_CONFIG.DEFAULT_PACKAGE.insurance_value,
      service_type_id: options?.serviceTypeId ?? 2, // Default: Standard Delivery (matches Backend)
      cod_value: options?.codValue,
    };

    const response = await ghnApi.calculateShippingFee(request);
    
    if (response.success && response.data !== null) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to calculate shipping fee');
    }
  }

  throw new Error('Missing GHN district ID or ward code');
};

// Fallback mock calculation for addresses without GHN IDs
const calculateMockShippingFee = (address: AddressData): GHNShippingFeeData => {
  let fee = 0;
  
  if (address.province) {
    const province = address.province.toLowerCase();
    
    if (province.includes('hà nội') || province.includes('hanoi')) {
      fee = 30000; // 30k for Hanoi
    } else if (province.includes('hồ chí minh') || province.includes('ho chi minh') || province.includes('tp.hcm')) {
      fee = 25000; // 25k for HCMC
    } else if (province.includes('đà nẵng') || province.includes('da nang')) {
      fee = 35000; // 35k for Da Nang
    } else if (province.includes('hải phòng') || province.includes('hai phong')) {
      fee = 40000; // 40k for Hai Phong
    } else {
      fee = 50000; // 50k for other provinces
    }
  }

  return {
    total: fee,
    service_fee: fee,
    insurance_fee: 0,
    pick_station_fee: 0,
    coupon_value: 0,
    r2s_fee: 0,
    document_return: 0,
    double_check: 0,
    cod_fee: 0,
    pick_remote_areas_fee: 0,
    deliver_remote_areas_fee: 0,
    cod_failed_fee: 0,
  };
};

export const useShippingFee = (address: AddressData, options?: ShippingFeeOptions) => {
  const [shippingFee, setShippingFee] = useState<ShippingFeeData>({
    fee: 0,
    isCalculating: false,
  });

  // Create stable dependencies to prevent infinite loops
  const addressKey = useMemo(() => {
    return JSON.stringify({
      province: address.province,
      district: address.district,
      ward: address.ward,
      provinceId: address.provinceId,
      districtId: address.districtId,
      wardCode: address.wardCode,
    });
  }, [address.province, address.district, address.ward, address.provinceId, address.districtId, address.wardCode]);

  const optionsKey = useMemo(() => {
    return JSON.stringify(options || {});
  }, [options]);

  useEffect(() => {
    const calculateFee = async () => {
      // Parse address and options from stable keys
      const addr = JSON.parse(addressKey) as AddressData;
      const opts = JSON.parse(optionsKey) as ShippingFeeOptions | null;
      
      // Check if we have enough data for calculation
      const hasTextData = addr.province;
      const hasGHNData = addr.districtId && addr.wardCode;
      
      if (!hasTextData && !hasGHNData) {
        setShippingFee({ fee: 0, isCalculating: false });
        return;
      }

      setShippingFee(prev => ({ ...prev, isCalculating: true, error: undefined }));

      try {
        // Try GHN API first if we have the required IDs
        if (hasGHNData) {
          const feeData = await calculateShippingFeeFromGHN(addr, opts || undefined);
          setShippingFee({ 
            fee: feeData.total, 
            isCalculating: false,
            details: feeData
          });
        } else {
          // Fallback to mock calculation
          const feeData = calculateMockShippingFee(addr);
          setShippingFee({ 
            fee: feeData.total, 
            isCalculating: false,
            details: feeData
          });
        }
      } catch (error) {
        console.error('Shipping fee calculation error:', error);
        // Fallback to mock on error
        const mockFee = calculateMockShippingFee(addr);
        setShippingFee({
          fee: mockFee.total,
          isCalculating: false,
          details: mockFee,
          error: error instanceof Error ? error.message : 'Không thể tính phí ship từ GHN. Đang sử dụng phí ước tính.'
        });
      }
    };

    calculateFee();
  }, [addressKey, optionsKey]); // Only depend on stable string keys

  return shippingFee;
};

// Standalone function to calculate shipping fee (for use outside React components)
export const calculateShippingFee = async (
  toDistrictId: number,
  toWardCode: string,
  options?: ShippingFeeOptions
): Promise<GHNShippingFeeData> => {
  const fromDistrictId = parseInt(GHN_CONFIG.FROM_DISTRICT_ID || '0');
  
  const request: GHNShippingFeeRequest = {
    from_district_id: fromDistrictId > 0 ? fromDistrictId : undefined,
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    height: options?.height ?? GHN_CONFIG.DEFAULT_PACKAGE.height,
    length: options?.length ?? GHN_CONFIG.DEFAULT_PACKAGE.length,
    weight: calculateWeight(options),
    width: options?.width ?? GHN_CONFIG.DEFAULT_PACKAGE.width,
    insurance_value: options?.insuranceValue ?? GHN_CONFIG.DEFAULT_PACKAGE.insurance_value,
    service_type_id: options?.serviceTypeId ?? 2, // Standard Delivery
    cod_value: options?.codValue,
  };

  const response = await ghnApi.calculateShippingFee(request);
  
  if (response.success && response.data !== null) {
    return response.data;
  }
  
  throw new Error(response.message || 'Failed to calculate shipping fee');
};
