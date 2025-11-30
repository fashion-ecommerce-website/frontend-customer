import { useState, useEffect, useMemo } from 'react';
import { ghnApi, GHNShippingFeeRequest } from '@/services/api/ghnApi';
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
}

// GHN shipping fee calculation
const calculateShippingFee = async (address: AddressData): Promise<number> => {
  // Check if we have GHN IDs for accurate calculation
  if (address.provinceId && address.districtId && address.wardCode) {
    try {
      const request: GHNShippingFeeRequest = {
        from_district_id: parseInt(GHN_CONFIG.FROM_DISTRICT_ID || '0'),
        to_district_id: address.districtId,
        to_ward_code: address.wardCode,
        height: GHN_CONFIG.DEFAULT_PACKAGE.height,
        length: GHN_CONFIG.DEFAULT_PACKAGE.length,
        weight: GHN_CONFIG.DEFAULT_PACKAGE.weight,
        width: GHN_CONFIG.DEFAULT_PACKAGE.width,
        insurance_value: GHN_CONFIG.DEFAULT_PACKAGE.insurance_value,
        service_type_id: 2 // Standard delivery
      };

      const response = await ghnApi.calculateShippingFee(request);
      
      if (response.success && response.data !== null) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to calculate shipping fee');
      }
    } catch (error) {
      console.error('GHN API error:', error);
      throw error;
    }
  }

  // Fallback to mock calculation for addresses without GHN IDs
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!address.province) {
        resolve(0);
        return;
      }

      // Mock shipping fee calculation based on province
      const province = address.province.toLowerCase();
      
      if (province.includes('hà nội') || province.includes('hanoi')) {
        resolve(30000); // 30k for Hanoi
      } else if (province.includes('hồ chí minh') || province.includes('ho chi minh') || province.includes('tp.hcm')) {
        resolve(25000); // 25k for HCMC
      } else if (province.includes('đà nẵng') || province.includes('da nang')) {
        resolve(35000); // 35k for Da Nang
      } else if (province.includes('hải phòng') || province.includes('hai phong')) {
        resolve(40000); // 40k for Hai Phong
      } else {
        resolve(50000); // 50k for other provinces
      }
    }, 500);
  });
};

export const useShippingFee = (address: AddressData) => {
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

  useEffect(() => {
    const calculateFee = async () => {
      // Check if we have enough data for calculation
      const hasTextData = address.province;
      const hasGHNData = address.provinceId && address.districtId && address.wardCode;
      
      if (!hasTextData && !hasGHNData) {
        setShippingFee({ fee: 0, isCalculating: false });
        return;
      }

      setShippingFee(prev => ({ ...prev, isCalculating: true, error: undefined }));

      try {
        const fee = await calculateShippingFee(address);
        setShippingFee({ fee, isCalculating: false });
      } catch (error) {
        console.error('Shipping fee calculation error:', error);
        setShippingFee({
          fee: 0,
          isCalculating: false,
          error: error instanceof Error ? error.message : 'Không thể tính phí ship. Vui lòng thử lại.'
        });
      }
    };

    calculateFee();
  }, [addressKey, address]);

  return shippingFee;
};
