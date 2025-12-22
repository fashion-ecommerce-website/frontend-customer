'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Address } from '@/services/api/addressApi';

interface AddressSectionProps {
  addresses?: Address[];
  isLoading?: boolean;
  error?: { message: string } | null;
  onAddAddress?: () => void;
  onUpdateAddress?: (address: Address) => void;
  onDeleteAddress?: (addressId: number) => void;
  onClearError?: () => void;
}

export const AddressPresenter: React.FC<AddressSectionProps> = ({
  addresses = [],
  isLoading = false,
  error = null,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onClearError,
}) => {
  const handleUpdateClick = (address: Address) => {
    if (onUpdateAddress) {
      onUpdateAddress(address);
    }
  };

  const handleAddClick = () => {
    if (onAddAddress) {
      onAddAddress();
    }
  };

  const { translations } = useLanguage();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">{translations.profile.addressesHeader}</h2>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">{translations.profile.loadingAddresses}</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">{translations.profile.addressesHeader}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error.message}</p>
          {onClearError && (
            <button
              onClick={onClearError}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
            >
              {translations.profile.tryAgain}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Sort addresses to put default address first
  const sortedAddresses = [...addresses].sort((a, b) => {
    const aIsDefault = a.isDefault || a.default;
    const bIsDefault = b.isDefault || b.default;
    
    // If one is default and the other isn't, default comes first
    if (aIsDefault && !bIsDefault) return -1;
    if (!aIsDefault && bIsDefault) return 1;
    
    // If both are default or both are not default, maintain original order
    return 0;
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-base sm:text-lg font-semibold text-black">
          {addresses.length} {translations.profile.addressesHeader}
        </h2>
      </div>
      
      {/* Address List */}
      <div className="space-y-4 sm:space-y-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{translations.profile.noAddressesFound}</p>
            <p className="text-sm text-gray-500">{translations.profile.addShippingAddress}</p>
          </div>
        ) : (
          sortedAddresses.map((address) => (
            <div
              key={address.id}
              className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {(address.isDefault || address.default) && (
                      <span className="text-xs sm:text-sm font-medium text-gray-900 border border-gray-300 px-2 py-1 rounded">
                        {translations.profile.defaultLabel}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                      {address.fullName}
                    </h3>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-900">
                    <div className="break-words">
                      <span className="font-semibold">{translations.checkout.address}:</span> {[address.line, address.ward, address.districtName, address.city].filter(Boolean).join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold">{translations.checkout.phone}:</span> {address.phone || translations.profile.phoneNotProvided}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 self-start">
                  <button
                    onClick={() => handleUpdateClick(address)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
                  >
                    {translations.profile.update}
                  </button>
                  {address.id && !(address.isDefault || address.default) && (
                    <button
                      onClick={() => onDeleteAddress && onDeleteAddress(address.id!)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors duration-200 cursor-pointer"
                    >
                      {translations.common.delete}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Address Button */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex justify-center">
        <button
          onClick={handleAddClick}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{translations.addressModal.addShippingAddress}</span>
        </button>
      </div>
    </div>
  );
};