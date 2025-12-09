'use client';

import React, { useState } from 'react';
import { Address, addressApi } from '@/services/api/addressApi';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

interface AddressListModalProps {
  isOpen: boolean;
  addresses: Address[];
  currentAddress: Address | null;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  onAddNew?: () => void;
  onEditAddress?: (address: Address) => void;
  onDeleteAddress?: (address: Address) => void;
  onAddressChange?: () => void; // Callback when addresses are modified
}

export const AddressListModal: React.FC<AddressListModalProps> = ({
  isOpen,
  addresses,
  currentAddress,
  onClose,
  onSelectAddress,
  onAddNew,
  onEditAddress,
  onDeleteAddress,
  onAddressChange,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const handleDeleteAddress = (address: Address) => {
    // Prevent deletion of default address
    if (address.isDefault || address.default) {
      setConfirmModal({
        isOpen: true,
        title: 'Cannot Delete Default Address',
        message: 'Cannot delete default address. Please set another address as default first.',
        type: 'warning',
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Address',
      message: `Are you sure you want to delete this address?\n\n${address.fullName}\n${[address.line, address.ward, address.districtName, address.city].filter(Boolean).join(', ')}`,
      type: 'danger',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        performDeleteAddress(address);
      },
    });
  };

  const performDeleteAddress = async (address: Address) => {
    setDeletingId(address.id!);
    
    try {
      const response = await addressApi.deleteAddress(address.id!);
      
      if (response.success) {
        // Call the callback to refresh addresses
        onAddressChange?.();
        
        // If the deleted address was selected, clear selection
        if (currentAddress?.id === address.id) {
          onSelectAddress(addresses.find(addr => addr.id !== address.id) || addresses[0]);
        }
      } else {
        setConfirmModal({
          isOpen: true,
          title: 'Delete Failed',
          message: `Failed to delete address: ${response.message}`,
          type: 'warning',
          onConfirm: () => {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch {
      setConfirmModal({
        isOpen: true,
        title: 'Error',
        message: 'An unexpected error occurred while deleting the address',
        type: 'warning',
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        },
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Select Delivery Address</h2>
          <div className="flex items-center gap-3">
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-transparent border border-black rounded-lg hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No addresses found</p>
              <p className="text-sm text-gray-500 mb-4">Please add an address in your profile first.</p>
              {onAddNew && (
                <button
                  onClick={onAddNew}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Address List */}
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    currentAddress?.id === address.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelectAddress(address)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{address.fullName}</h4>
                        {(address.isDefault || address.default) && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        {currentAddress?.id === address.id && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-sm text-gray-700">
                        {[address.line, address.ward, address.districtName, address.city].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {onEditAddress && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditAddress(address);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          title="Edit address"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {(onDeleteAddress || onAddressChange) && !(address.isDefault || address.default) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteAddress) {
                              onDeleteAddress(address);
                            } else {
                              handleDeleteAddress(address);
                            }
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Delete address"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isLoading={deletingId !== null}
      />
    </div>
  );
};
