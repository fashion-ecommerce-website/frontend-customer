'use client';

import React, { useState } from 'react';

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
}

interface AddressSectionProps {
  addresses?: Address[];
  isLoading?: boolean;
  error?: { message: string } | null;
  onAddAddress?: () => void;
  onUpdateAddress?: (address: Address) => void;
  onDeleteAddress?: (addressId: number) => void;
  onSetDefaultAddress?: (addressId: number) => void;
  onClearError?: () => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  addresses = [],
  isLoading = false,
  error = null,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full">
        {/* Thick horizontal line */}
        <div className="w-full h-0.5 bg-black mb-8"></div>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading addresses...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full">
        {/* Thick horizontal line */}
        <div className="w-full h-0.5 bg-black mb-8"></div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error.message}</p>
          {onClearError && (
            <button
              onClick={onClearError}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Try Again
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
    <div className="w-full">
      {/* Thick horizontal line */}
      <div className="w-full h-0.5 bg-black mb-8"></div>
      
      {/* Address List */}
      <div className="space-y-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No addresses found</p>
            <p className="text-sm text-gray-500">Add your first shipping address to get started</p>
          </div>
        ) : (
          sortedAddresses.map((address) => (
            <div
              key={address.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {(address.isDefault || address.default) && (
                      <span className="text-sm font-medium text-gray-900 border border-gray-300 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900">
                      {address.fullName}
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-900">
                    <div>
                      <span className="font-semibold">Address:</span> {address.line}, {address.ward}, {address.city}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {address.phone || 'Not provided'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleUpdateClick(address)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    Update
                  </button>
                  {address.id && !(address.isDefault || address.default) && (
                    <button
                      onClick={() => onDeleteAddress && onDeleteAddress(address.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Address Button */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
        <button
          onClick={handleAddClick}
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>Add shipping address</span>
        </button>
      </div>
    </div>
  );
};