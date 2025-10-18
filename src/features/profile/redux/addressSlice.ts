import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '../../../services/api/addressApi';
import { ApiError } from '../../../types/api.types';

// Address state interface
export interface AddressState {
  // Data
  addresses: Address[];
  currentAddress: Address | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: ApiError | null;
  createError: ApiError | null;
  updateError: ApiError | null;
  deleteError: ApiError | null;
  
  // Success states
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

// Initial state
const initialState: AddressState = {
  addresses: [],
  currentAddress: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// Address slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Get addresses
    getAddressesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getAddressesSuccess: (state, action: PayloadAction<Address[]>) => {
      state.isLoading = false;
      state.addresses = action.payload;
      state.error = null;
    },
    getAddressesFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create address
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAddressRequest: (state, _action: PayloadAction<CreateAddressRequest>) => {
      state.isCreating = true;
      state.createError = null;
      state.createSuccess = false;
    },
    createAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isCreating = false;
      state.addresses.push(action.payload);
      state.createSuccess = true;
      state.createError = null;
    },
    createAddressFailure: (state, action: PayloadAction<ApiError>) => {
      state.isCreating = false;
      state.createError = action.payload;
      state.createSuccess = false;
    },

    // Update address
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAddressRequest: (state, _action: PayloadAction<UpdateAddressRequest>) => {
      state.isUpdating = true;
      state.updateError = null;
      state.updateSuccess = false;
    },
    updateAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isUpdating = false;
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      state.updateSuccess = true;
      state.updateError = null;
    },
    updateAddressFailure: (state, action: PayloadAction<ApiError>) => {
      state.isUpdating = false;
      state.updateError = action.payload;
      state.updateSuccess = false;
    },

    // Delete address
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteAddressRequest: (state, _action: PayloadAction<number>) => {
      state.isDeleting = true;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
    deleteAddressSuccess: (state, action: PayloadAction<number>) => {
      state.isDeleting = false;
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      state.deleteSuccess = true;
      state.deleteError = null;
    },
    deleteAddressFailure: (state, action: PayloadAction<ApiError>) => {
      state.isDeleting = false;
      state.deleteError = action.payload;
      state.deleteSuccess = false;
    },

    // Set default address
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDefaultAddressRequest: (state, _action: PayloadAction<number>) => {
      state.isUpdating = true;
      state.updateError = null;
    },
    setDefaultAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isUpdating = false;
      // Update all addresses to set isDefault correctly
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === action.payload.id,
        default: addr.id === action.payload.id,
      }));
      state.updateError = null;
    },
    setDefaultAddressFailure: (state, action: PayloadAction<ApiError>) => {
      state.isUpdating = false;
      state.updateError = action.payload;
    },

    // Set current address
    setCurrentAddress: (state, action: PayloadAction<Address | null>) => {
      state.currentAddress = action.payload;
    },

    // Clear error states
    clearError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },

    // Clear success states
    clearSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },

    // Reset state
    resetAddressState: () => initialState,
  },
});

// Export actions
export const {
  getAddressesRequest,
  getAddressesSuccess,
  getAddressesFailure,
  createAddressRequest,
  createAddressSuccess,
  createAddressFailure,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,
  setDefaultAddressRequest,
  setDefaultAddressSuccess,
  setDefaultAddressFailure,
  setCurrentAddress,
  clearError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearSuccess,
  resetAddressState,
} = addressSlice.actions;

// Selectors
export const selectAddressState = (state: { address: AddressState }) => state.address;
export const selectAddresses = (state: { address: AddressState }) => state.address.addresses;
export const selectCurrentAddress = (state: { address: AddressState }) => state.address.currentAddress;
export const selectIsLoading = (state: { address: AddressState }) => state.address.isLoading;
export const selectIsCreating = (state: { address: AddressState }) => state.address.isCreating;
export const selectIsUpdating = (state: { address: AddressState }) => state.address.isUpdating;
export const selectIsDeleting = (state: { address: AddressState }) => state.address.isDeleting;
export const selectError = (state: { address: AddressState }) => state.address.error;
export const selectCreateError = (state: { address: AddressState }) => state.address.createError;
export const selectUpdateError = (state: { address: AddressState }) => state.address.updateError;
export const selectDeleteError = (state: { address: AddressState }) => state.address.deleteError;
export const selectCreateSuccess = (state: { address: AddressState }) => state.address.createSuccess;
export const selectUpdateSuccess = (state: { address: AddressState }) => state.address.updateSuccess;
export const selectDeleteSuccess = (state: { address: AddressState }) => state.address.deleteSuccess;

// Export reducer
export const addressReducer = addressSlice.reducer;
export default addressSlice.reducer;