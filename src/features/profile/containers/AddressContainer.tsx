'use client';

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { AddressPresenter } from '../components/AddressPresenter';
import { AddressModal } from '../components/AddressModal';
import { ConfirmModal } from '../../../components/modals/ConfirmModal';
import { useToast } from '../../../providers/ToastProvider';
import { Address } from '../../../services/api/addressApi';
import {
  getAddressesRequest,
  createAddressRequest,
  updateAddressRequest,
  deleteAddressRequest,
  setCurrentAddress,
  clearError,
  clearCreateError,
  clearUpdateError,
  clearSuccess,
  selectAddresses,
  selectCurrentAddress,
  selectIsLoading,
  selectIsCreating,
  selectIsUpdating,
  selectIsDeleting,
  selectError,
  selectCreateError,
  selectUpdateError,
  selectDeleteError,
  selectCreateSuccess,
  selectUpdateSuccess,
  selectDeleteSuccess,
} from '../redux/addressSlice';

interface AddressContainerProps {
  onAddressChange?: (addresses: Address[]) => void;
  onError?: (error: string) => void;
}

export const AddressContainer: React.FC<AddressContainerProps> = ({
  onAddressChange,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  
  // Redux state
  const addresses = useAppSelector(selectAddresses);
  const currentAddress = useAppSelector(selectCurrentAddress);
  const isLoading = useAppSelector(selectIsLoading);
  const isCreating = useAppSelector(selectIsCreating);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isDeleting = useAppSelector(selectIsDeleting);
  const error = useAppSelector(selectError);
  const createError = useAppSelector(selectCreateError);
  const updateError = useAppSelector(selectUpdateError);
  const deleteError = useAppSelector(selectDeleteError);
  const createSuccess = useAppSelector(selectCreateSuccess);
  const updateSuccess = useAppSelector(selectUpdateSuccess);
  const deleteSuccess = useAppSelector(selectDeleteSuccess);

  // Local state for modal
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [addressToDelete, setAddressToDelete] = React.useState<number | null>(null);

  // Load addresses on component mount
  useEffect(() => {
    console.log('AddressContainer: Loading addresses...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    console.log('AddressContainer: Access token exists:', !!token);
    
    if (!token) {
      console.error('AddressContainer: No access token found');
      return;
    }
    
    dispatch(getAddressesRequest());
  }, [dispatch]);

  // Debug logging for addresses state
  useEffect(() => {
    console.log('AddressContainer: addresses updated:', addresses);
    console.log('AddressContainer: isLoading:', isLoading);
    console.log('AddressContainer: error:', error);
  }, [addresses, isLoading, error]);

  // Handle address change callback
  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(addresses);
    }
  }, [addresses, onAddressChange]);

  // Handle errors
  useEffect(() => {
    const errorMessage = error?.message || createError?.message || updateError?.message || deleteError?.message;
    if (errorMessage && onError) {
      onError(errorMessage);
    }
  }, [error, createError, updateError, deleteError, onError]);

  // Handle success states - close modal and clear success flags
  useEffect(() => {
    if (createSuccess) {
      setShowModal(false);
      setCurrentAddress(null);
      showSuccess('Your shipping address has been added successfully.');
      dispatch(clearSuccess());
    }
    if (updateSuccess) {
      setShowModal(false);
      setCurrentAddress(null);
      showSuccess('Your shipping address has been updated successfully.');
      dispatch(clearSuccess());
    }
  }, [createSuccess, updateSuccess, dispatch, showSuccess]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
      showSuccess('Your shipping address has been deleted successfully.');
      dispatch(clearSuccess());
    }
  }, [deleteSuccess, dispatch, showSuccess]);

  // Handle errors with toast
  useEffect(() => {
    if (createError) {
      showError(`Failed to create address: ${createError.message}`);
    }
    if (updateError) {
      showError(`Failed to update address: ${updateError.message}`);
    }
    if (deleteError) {
      showError(`Failed to delete address: ${deleteError.message}`);
    }
  }, [createError, updateError, deleteError, showError]);

  // Handle add address
  const handleAddAddress = useCallback(() => {
    dispatch(setCurrentAddress(null));
    setShowModal(true);
  }, [dispatch]);

  // Handle update address
  const handleUpdateAddress = useCallback((address: Address) => {
    dispatch(setCurrentAddress(address));
    setShowModal(true);
  }, [dispatch]);

  // Handle delete address
  const handleDeleteAddress = useCallback((addressId: number) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    dispatch(setCurrentAddress(null));
    dispatch(clearCreateError());
    dispatch(clearUpdateError());
  }, [dispatch]);

  // Handle address save
  const handleAddressSave = useCallback((addressData: Address) => {
    if (currentAddress?.id) {
      // Update existing address
      dispatch(updateAddressRequest({
        id: currentAddress.id,
        fullName: addressData.fullName,
        phone: addressData.phone,
        line: addressData.line,
        ward: addressData.ward,
        city: addressData.city,
        countryCode: addressData.countryCode,
        isDefault: addressData.isDefault,
      }));
    } else {
      // Create new address
      dispatch(createAddressRequest({
        fullName: addressData.fullName,
        phone: addressData.phone,
        line: addressData.line,
        ward: addressData.ward,
        city: addressData.city,
        countryCode: addressData.countryCode,
        isDefault: addressData.isDefault,
      }));
    }
  }, [currentAddress, dispatch]);

  // Handle clear errors
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle delete confirmation
  const handleConfirmDelete = useCallback(() => {
    if (addressToDelete) {
      dispatch(deleteAddressRequest(addressToDelete));
    }
  }, [addressToDelete, dispatch]);

  // Handle delete cancellation
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  }, []);

  return (
    <>
      <AddressPresenter
        addresses={addresses}
        isLoading={isLoading}
        error={error}
        onAddAddress={handleAddAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
        onClearError={handleClearError}
      />
      
      <AddressModal
        isOpen={showModal}
        address={currentAddress}
        onClose={handleModalClose}
        onSave={handleAddressSave}
        isLoading={isCreating || isUpdating}
      />
      
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        type="danger"
      />
    </>
  );
};

export default AddressContainer;