import { useState, useEffect } from 'react';

export interface AddressData {
  province?: string;
  district?: string;
  ward?: string;
}

export interface ShippingFeeData {
  fee: number;
  isCalculating: boolean;
  error?: string;
}

// Mock shipping fee calculation based on address
const calculateShippingFee = (address: AddressData): Promise<number> => {
  return new Promise((resolve) => {
    // Simulate API call delay
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

  useEffect(() => {
    const calculateFee = async () => {
      if (!address.province) {
        setShippingFee({ fee: 0, isCalculating: false });
        return;
      }

      setShippingFee(prev => ({ ...prev, isCalculating: true, error: undefined }));

      try {
        const fee = await calculateShippingFee(address);
        setShippingFee({ fee, isCalculating: false });
      } catch (error) {
        setShippingFee({
          fee: 0,
          isCalculating: false,
          error: 'Không thể tính phí ship. Vui lòng thử lại.'
        });
      }
    };

    calculateFee();
  }, [address.province, address.district, address.ward]);

  return shippingFee;
};
