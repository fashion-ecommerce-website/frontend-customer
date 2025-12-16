import React from 'react';
import { useOrder } from '@/features/order/hooks/useOrder';
import { AddressListModal } from '@/features/order/components/AddressListModal';
import { AddressModal } from '@/features/profile/components/AddressModal';
import { Address, CreateAddressRequest, UpdateAddressRequest, addressApi } from '@/services/api/addressApi';

export type AddressFormProps = {
  onChange?: (values: Record<string, string>) => void;
  onAddressSelect?: (address: Address) => void;
};

export function AddressForm({ onChange, onAddressSelect }: AddressFormProps): React.ReactElement {
  const {
    addresses,
    selectedAddress,
    isAddressLoading,
    addressError,
    isAddressModalOpen,
    isAddressFormModalOpen,
    editingAddress,
    selectAddress,
    loadAddresses,
    openAddressListModal,
    closeAddressListModal,
    openAddressFormModal,
    closeAddressFormModal,
  } = useOrder();


  const handleSelectAddress = (address: Address) => {
    selectAddress(address);
    // Trigger onChange with address data for shipping calculation
    onChange?.({
      province: address.city,
      district: address.city,
      ward: address.ward,
      address: address.line,
      name: address.fullName,
      phone: address.phone,
    });
    // Notify parent component about address selection
    onAddressSelect?.(address);
  };

  const handleAddressSuccess = (address: Address) => {
    // Refresh addresses list
    loadAddresses();
    
    // If this is a new address or the edited address, select it
    if (!editingAddress || editingAddress.id === address.id) {
      selectAddress(address);
      handleSelectAddress(address);
    }
    
    // Close form modal
    closeAddressFormModal();
  };

  const handleAddressSave = async (address: Address) => {
    try {
      if (editingAddress?.id) {
        // Update existing address
        const updateData: UpdateAddressRequest = {
          id: editingAddress.id,
          fullName: address.fullName,
          phone: address.phone,
          line: address.line,
          ward: address.ward,
          city: address.city,
          countryCode: address.countryCode,
          isDefault: address.isDefault,
          provinceId: address.provinceId,
          districtId: address.districtId,
          districtName: address.districtName,
          wardCode: address.wardCode,
        };
        const response = await addressApi.updateAddress(updateData);
        if (response.success && response.data) {
          handleAddressSuccess(response.data);
        }
      } else {
        // Create new address
        const createData: CreateAddressRequest = {
          fullName: address.fullName,
          phone: address.phone,
          line: address.line,
          ward: address.ward,
          city: address.city,
          countryCode: address.countryCode,
          isDefault: address.isDefault,
          provinceId: address.provinceId,
          districtId: address.districtId,
          districtName: address.districtName,
          wardCode: address.wardCode,
        };
        const response = await addressApi.createAddress(createData);
        if (response.success && response.data) {
          handleAddressSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleAddNew = () => {
    openAddressFormModal(null);
  };

  const handleEditAddress = (address: Address) => {
    openAddressFormModal(address);
  };

  const handleAddressChange = () => {
    // Refresh addresses when they are modified
    loadAddresses();
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-800 text-base font-bold uppercase tracking-wide">Delivery Address</h3>
          {addresses.length > 0 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {addresses.length} address{addresses.length > 1 ? 'es' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="rounded-sm bg-white border border-neutral-200 p-4">
        
        {isAddressLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading address...
          </div>
        ) : addressError ? (
          <div className="text-sm text-red-600">
            Error loading addresses: {addressError}
          </div>
        ) : selectedAddress ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">{selectedAddress.fullName}</h4>
                {(selectedAddress.isDefault || selectedAddress.default) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            <button
              type="button"
              className="text-sm text-gray-700 font-medium border border-gray-600 hover:border-gray-800 px-3 py-1 rounded transition-colors cursor-pointer"
              onClick={openAddressListModal}
            >
              Select Address
            </button>
            </div>
            <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
            <p className="text-sm text-gray-700">
              {[selectedAddress.line, selectedAddress.ward, selectedAddress.districtName, selectedAddress.city].filter(Boolean).join(', ')}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              No address available. Please add an address!
            </div>
            <button
              type="button"
              className="text-sm text-gray-700 hover:text-black font-medium border border-gray-700 hover:border-black px-3 py-1 rounded transition-colors cursor-pointer"
              onClick={handleAddNew}
            >
              Add New
            </button>
          </div>
        )}
      </div>

      <AddressListModal
        isOpen={isAddressModalOpen}
        addresses={addresses}
        currentAddress={selectedAddress}
        onClose={closeAddressListModal}
        onSelectAddress={handleSelectAddress}
        onAddNew={handleAddNew}
        onEditAddress={handleEditAddress}
        onAddressChange={handleAddressChange}
      />

      <AddressModal
        isOpen={isAddressFormModalOpen}
        address={editingAddress}
        onClose={closeAddressFormModal}
        onSave={handleAddressSave}
        isLoading={false}
        isFirstAddress={addresses.length === 0 && !editingAddress}
      />
    </div>
  );
}


