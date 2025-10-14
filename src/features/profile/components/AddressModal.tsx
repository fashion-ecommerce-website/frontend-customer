'use client';

import React, { useState, useEffect } from 'react';
import { ghnApi, GHNProvince, GHNDistrict, GHNWard } from '@/services/api/ghnApi';

interface Address {
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
  // GHN Integration fields
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
}

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

  // Load provinces on mount
  useEffect(() => {
    if (isOpen) {
      loadProvinces();
    }
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
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict);
      // Reset ward selection
      setSelectedWard(null);
      setWards([]);
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
        city: district?.DistrictName || prev.city,
        ward: ward?.WardName || prev.ward,
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
        setProvinces(response.data);
      } else {
        setGhnError(response.message || 'Failed to load provinces');
      }
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setGhnError('Failed to load wards');
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value ? parseInt(value) : null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value ? parseInt(value) : null);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedWard(value || null);
  };

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

          {/* Address Line Field */}
          <div>
            <label htmlFor="line" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line
            </label>
            <input
              type="text"
              id="line"
              value={formData.line}
              onChange={(e) => handleInputChange('line', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black ${
                errors.line ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Street address, apartment, suite, etc."
              disabled={isLoading}
            />
            {errors.line && (
              <p className="mt-1 text-sm text-red-600">{errors.line}</p>
            )}
          </div>

          {/* Province Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province/City <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProvince || ''}
              onChange={handleProvinceChange}
              disabled={isLoading || loading.provinces}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
            >
              <option value="">Select province/city</option>
              {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
            </select>
            {loading.provinces && (
              <p className="text-xs text-gray-500 mt-1">Loading...</p>
            )}
            {errors.provinceId && (
              <p className="mt-1 text-sm text-red-600">{errors.provinceId}</p>
            )}
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDistrict || ''}
              onChange={handleDistrictChange}
              disabled={isLoading || loading.districts || !selectedProvince}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
            >
              <option value="">Select district</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
            {loading.districts && (
              <p className="text-xs text-gray-500 mt-1">Loading...</p>
            )}
            {errors.districtId && (
              <p className="mt-1 text-sm text-red-600">{errors.districtId}</p>
            )}
          </div>

          {/* Ward Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedWard || ''}
              onChange={handleWardChange}
              disabled={isLoading || loading.wards || !selectedDistrict}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
            >
              <option value="">Select ward</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
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

          {/* Country Code Field */}
          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="countryCode"
              value={formData.countryCode}
              onChange={(e) => handleInputChange('countryCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black ${
                errors.countryCode ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">-- Please Select --</option>
              <option value="VN">Vietnam</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
            </select>
            {errors.countryCode && (
              <p className="mt-1 text-sm text-red-600">{errors.countryCode}</p>
            )}
          </div>

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