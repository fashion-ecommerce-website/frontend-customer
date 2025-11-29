'use client';

import React, { useState, useEffect } from 'react';
import { Address } from '@/services/api/addressApi';
import { ghnApi, GHNProvince, GHNDistrict, GHNWard } from '@/services/api/ghnApi';

interface AddressModalProps {
  isOpen: boolean;
  address?: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
  isLoading?: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  address,
  onClose,
  onSave,
  isLoading = false,
}) => {
  // Error map for form fields
  type AddressField = keyof Address;
  type AddressErrors = Partial<Record<AddressField, string>>;

  const [formData, setFormData] = useState<Address>({
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    line: address?.line || '',
    ward: address?.ward || '',
    city: address?.city || '',
    countryCode: address?.countryCode || 'VN',
    isDefault: address?.isDefault || address?.default || false,
    provinceId: address?.provinceId,
    districtId: address?.districtId,
    wardCode: address?.wardCode,
  });

  const [errors, setErrors] = useState<AddressErrors>({});

  // GHN API states
  const [provinces, setProvinces] = useState<GHNProvince[]>([]);
  const [districts, setDistricts] = useState<GHNDistrict[]>([]);
  const [wards, setWards] = useState<GHNWard[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<number | null>(address?.provinceId || null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(address?.districtId || null);
  const [selectedWard, setSelectedWard] = useState<string | null>(address?.wardCode || null);
  
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  });
  
  const [ghnError, setGhnError] = useState<string | null>(null);
  
  // Custom dropdown states
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isWardOpen, setIsWardOpen] = useState(false);
  
  // Search states
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');

  // Load provinces on mount
  useEffect(() => {
    if (isOpen) {
      loadProvinces();
    }
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsProvinceOpen(false);
        setIsDistrictOpen(false);
        setIsWardOpen(false);
        // Clear search when closing
        setProvinceSearch('');
        setDistrictSearch('');
        setWardSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince);
      // Reset district and ward selections
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
      // Close other dropdowns but keep province dropdown open if user is still interacting
      setIsDistrictOpen(false);
      setIsWardOpen(false);
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict);
      // Reset ward selection
      setSelectedWard(null);
      setWards([]);
      // Close ward dropdown but keep district dropdown open if user is still interacting
      setIsWardOpen(false);
    }
  }, [selectedDistrict]);

  // Update form data when GHN selections change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const province = provinces.find(p => p.ProvinceID === selectedProvince);
      const district = districts.find(d => d.DistrictID === selectedDistrict);
      const ward = wards.find(w => w.WardCode === selectedWard);
      
      setFormData(prev => ({
        ...prev,
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        wardCode: selectedWard,
        city: province?.ProvinceName || prev.city,
        ward: district?.DistrictName || prev.ward,
        line: ward?.WardName || prev.line,
      }));

      // Clear GHN-related errors
      setErrors(prev => ({
        ...prev,
        provinceId: undefined,
        districtId: undefined,
        wardCode: undefined,
      }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards]);

  // Reset form when modal opens/closes or address changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: address?.fullName || '',
        phone: address?.phone || '',
        line: address?.line || '',
        ward: address?.ward || '',
        city: address?.city || '',
        countryCode: address?.countryCode || 'VN',
        isDefault: address?.isDefault || address?.default || false,
        provinceId: address?.provinceId,
        districtId: address?.districtId,
        wardCode: address?.wardCode,
      });
      setSelectedProvince(address?.provinceId || null);
      setSelectedDistrict(address?.districtId || null);
      setSelectedWard(address?.wardCode || null);
      setErrors({});
    }
  }, [isOpen, address]);

  const loadProvinces = async () => {
    setLoading(prev => ({ ...prev, provinces: true }));
    setGhnError(null);
    
    try {
      const response = await ghnApi.getProvinces();
      if (response.success && response.data) {
        // Skip the first 4 test addresses in dev mode
        const filteredProvinces = response.data.slice(4);
        setProvinces(filteredProvinces);
      } else {
        setGhnError(response.message || 'Failed to load provinces');
      }
    } catch {
      setGhnError('Failed to load provinces');
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadDistricts = async (provinceId: number) => {
    setLoading(prev => ({ ...prev, districts: true }));
    setGhnError(null);
    
    try {
      const response = await ghnApi.getDistricts(provinceId);
      if (response.success && response.data) {
        setDistricts(response.data);
      } else {
        setGhnError(response.message || 'Failed to load districts');
      }
    } catch {
      setGhnError('Failed to load districts');
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const loadWards = async (districtId: number) => {
    setLoading(prev => ({ ...prev, wards: true }));
    setGhnError(null);
    
    try {
      const response = await ghnApi.getWards(districtId);
      if (response.success && response.data) {
        setWards(response.data);
      } else {
        setGhnError(response.message || 'Failed to load wards');
      }
    } catch {
      setGhnError('Failed to load wards');
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  // Custom dropdown handlers
  const handleProvinceSelect = (provinceId: number) => {
    setSelectedProvince(provinceId);
    setIsProvinceOpen(false);
    setProvinceSearch('');
    // Close other dropdowns
    setIsDistrictOpen(false);
    setIsWardOpen(false);
  };

  const handleDistrictSelect = (districtId: number) => {
    setSelectedDistrict(districtId);
    setIsDistrictOpen(false);
    setDistrictSearch('');
    // Close other dropdowns
    setIsWardOpen(false);
  };

  const handleWardSelect = (wardCode: string) => {
    setSelectedWard(wardCode);
    setIsWardOpen(false);
    setWardSearch('');
  };

  // Filter functions
  const filteredProvinces = provinces.filter(province =>
    province.ProvinceName.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.DistrictName.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredWards = wards.filter(ward =>
    ward.WardName.toLowerCase().includes(wardSearch.toLowerCase())
  );

  const validatePhoneNumber = (phone: string, countryCode: string): string | null => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!cleanPhone) {
      return 'Phone number is required';
    }

    // Vietnam phone number validation
    if (countryCode === 'VN') {
      // Vietnamese phone numbers: 10-11 digits starting with 0 or +84
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return 'Vietnamese phone number must be 10-11 digits';
      }
      
      // Check if it starts with valid Vietnamese mobile prefixes
      const validPrefixes = ['03', '05', '07', '08', '09'];
      const firstTwoDigits = cleanPhone.substring(0, 2);
      
      if (!validPrefixes.includes(firstTwoDigits)) {
        return 'Invalid Vietnamese mobile number format';
      }
    } else {
      // International phone number validation (basic)
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return 'Phone number must be 7-15 digits';
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: AddressErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Enhanced phone validation
    const phoneError = validatePhoneNumber(formData.phone, formData.countryCode);
    if (phoneError) {
      newErrors.phone = phoneError;
    }


    if (!formData.ward.trim()) {
      newErrors.ward = 'Ward is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Validate GHN fields
    if (!formData.provinceId) {
      newErrors.provinceId = 'Province is required';
    }

    if (!formData.districtId) {
      newErrors.districtId = 'District is required';
    }

    if (!formData.wardCode) {
      newErrors.wardCode = 'Ward is required';
    }

    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        id: address?.id,
        userId: address?.userId,
      });
    }
  };

  const handleInputChange = (field: AddressField, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Re-validate phone number when country code changes
    if (field === 'countryCode' && formData.phone) {
      const phoneError = validatePhoneNumber(formData.phone, value as string);
      if (phoneError) {
        setErrors(prev => ({
          ...prev,
          phone: phoneError,
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          phone: undefined,
        }));
      }
    }
  };


  const handleClose = () => {
    setFormData({
      fullName: '',
      phone: '',
      line: '',
      ward: '',
      city: '',
      countryCode: 'VN',
      isDefault: false,
    });
    setErrors({});
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setProvinces([]);
    setDistricts([]);
    setWards([]);
    setGhnError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl border border-gray-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
          disabled={isLoading}
        >
          ×
        </button>

        {/* Modal title */}
        <h2 className="text-xl font-semibold text-black mb-6">
          {address?.id ? 'Update shipping address' : 'Add shipping address'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('phone', value);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={formData.countryCode === 'VN' ? 'e.g., 0901234567' : 'Enter your phone number'}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
            {formData.countryCode === 'VN' && !errors.phone && formData.phone && (
              <p className="mt-1 text-xs text-gray-500">
                Vietnamese mobile numbers: 03xx, 05xx, 07xx, 08xx, 09xx
              </p>
            )}
          </div>

          {/* Address Line removed; using Ward as address line for API */}

           {/* Province Selection */}
           <div className="relative dropdown-container">
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Province/City <span className="text-red-500">*</span>
             </label>
             <div className="relative">
               <div className="relative">
                 <input
                   type="text"
                   value={provinceSearch || (selectedProvince ? provinces.find(p => p.ProvinceID === selectedProvince)?.ProvinceName || '' : '')}
                   onChange={(e) => {
                     setProvinceSearch(e.target.value);
                     if (!isProvinceOpen) {
                       setIsProvinceOpen(true);
                       setIsDistrictOpen(false);
                       setIsWardOpen(false);
                     }
                   }}
                   onFocus={() => {
                     setIsProvinceOpen(true);
                     setIsDistrictOpen(false);
                     setIsWardOpen(false);
                   }}
                   placeholder="Search province/city..."
                   disabled={isLoading || loading.provinces}
                   className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                 />
                 <div 
                   className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                   onClick={() => {
                     if (!isLoading && !loading.provinces) {
                       setIsProvinceOpen(!isProvinceOpen);
                       setIsDistrictOpen(false);
                       setIsWardOpen(false);
                     }
                   }}
                 >
                   <svg className={`w-4 h-4 transition-transform ${isProvinceOpen ? 'rotate-180' : ''} text-gray-400 pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>
               
               {isProvinceOpen && (
                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                   {filteredProvinces.length > 0 ? (
                     filteredProvinces.map((province) => (
                       <button
                         key={province.ProvinceID}
                         type="button"
                         onClick={() => handleProvinceSelect(province.ProvinceID)}
                         className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-black"
                       >
                         {province.ProvinceName}
                       </button>
                     ))
                   ) : (
                     <div className="px-3 py-2 text-gray-500 text-sm">
                       No province/city found
                     </div>
                   )}
                 </div>
               )}
             </div>
             {loading.provinces && (
               <p className="text-xs text-gray-500 mt-1">Loading...</p>
             )}
             {errors.provinceId && (
               <p className="mt-1 text-sm text-red-600">{errors.provinceId}</p>
             )}
           </div>

          {/* District Selection */}
          <div className="relative dropdown-container">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={districtSearch || (selectedDistrict ? districts.find(d => d.DistrictID === selectedDistrict)?.DistrictName || '' : '')}
                  onChange={(e) => {
                    setDistrictSearch(e.target.value);
                    if (!isDistrictOpen) {
                      setIsDistrictOpen(true);
                      setIsProvinceOpen(false);
                      setIsWardOpen(false);
                    }
                  }}
                  onFocus={() => {
                    setIsDistrictOpen(true);
                    setIsProvinceOpen(false);
                    setIsWardOpen(false);
                  }}
                   placeholder="Search district..."
                  disabled={isLoading || loading.districts || !selectedProvince}
                  className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => {
                    if (!isLoading && !loading.districts && selectedProvince) {
                      setIsDistrictOpen(!isDistrictOpen);
                      setIsProvinceOpen(false);
                      setIsWardOpen(false);
                    }
                  }}
                >
                  <svg className={`w-4 h-4 transition-transform ${isDistrictOpen ? 'rotate-180' : ''} text-gray-400 pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {isDistrictOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <button
                        key={district.DistrictID}
                        type="button"
                        onClick={() => handleDistrictSelect(district.DistrictID)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-black"
                      >
                        {district.DistrictName}
                      </button>
                    ))
                  ) : (
                     <div className="px-3 py-2 text-gray-500 text-sm">
                       No district found
                     </div>
                  )}
                </div>
              )}
            </div>
            {loading.districts && (
              <p className="text-xs text-gray-500 mt-1">Loading...</p>
            )}
            {errors.districtId && (
              <p className="mt-1 text-sm text-red-600">{errors.districtId}</p>
            )}
          </div>

          {/* Ward Selection */}
          <div className="relative dropdown-container">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={wardSearch || (selectedWard ? wards.find(w => w.WardCode === selectedWard)?.WardName || '' : '')}
                  onChange={(e) => {
                    setWardSearch(e.target.value);
                    if (!isWardOpen) {
                      setIsWardOpen(true);
                      setIsProvinceOpen(false);
                      setIsDistrictOpen(false);
                    }
                  }}
                  onFocus={() => {
                    setIsWardOpen(true);
                    setIsProvinceOpen(false);
                    setIsDistrictOpen(false);
                  }}
                   placeholder="Search ward..."
                  disabled={isLoading || loading.wards || !selectedDistrict}
                  className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => {
                    if (!isLoading && !loading.wards && selectedDistrict) {
                      setIsWardOpen(!isWardOpen);
                      setIsProvinceOpen(false);
                      setIsDistrictOpen(false);
                    }
                  }}
                >
                  <svg className={`w-4 h-4 transition-transform ${isWardOpen ? 'rotate-180' : ''} text-gray-400 pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {isWardOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredWards.length > 0 ? (
                    filteredWards.map((ward) => (
                      <button
                        key={ward.WardCode}
                        type="button"
                        onClick={() => handleWardSelect(ward.WardCode)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-black"
                      >
                        {ward.WardName}
                      </button>
                    ))
                  ) : (
                     <div className="px-3 py-2 text-gray-500 text-sm">
                       No ward found
                     </div>
                  )}
                </div>
              )}
            </div>
            {loading.wards && (
              <p className="text-xs text-gray-500 mt-1">Loading...</p>
            )}
            {errors.wardCode && (
              <p className="mt-1 text-sm text-red-600">{errors.wardCode}</p>
            )}
          </div>

          {/* GHN Error Display */}
          {ghnError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{ghnError}</p>
            </div>
          )}

          {/* Default Address Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-black">
              Set as default address.
            </label>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none mt-6"
          >
            {isLoading ? (address?.id ? 'Updating...' : 'Adding...') : (address?.id ? 'Update address' : 'Add address')}
          </button>
        </form>
      </div>
    </div>
  );
};