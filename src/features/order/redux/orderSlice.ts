import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '@/services/api/addressApi';
import { Order, CreateOrderRequest, PaymentMethod } from '../types';
import { ProductItem } from '@/services/api/productApi';

// State interface
export interface OrderState {
  // Address management
  addresses: Address[];
  selectedAddress: Address | null;
  isAddressLoading: boolean;
  addressError: string | null;

  // Order management
  order: Order | null;
  isOrderLoading: boolean;
  orderError: string | null;

  // Cart/Products
  cartProducts: ProductItem[];
  isCartLoading: boolean;
  cartError: string | null;

  // Shipping
  shippingFee: number;
  isShippingCalculating: boolean;
  shippingError: string | null;

  // Payment method
  selectedPaymentMethod: PaymentMethod;

  // UI state
  isAddressModalOpen: boolean;
  isAddressFormModalOpen: boolean;
  editingAddress: Address | null;
}

// Initial state
const initialState: OrderState = {
  addresses: [],
  selectedAddress: null,
  isAddressLoading: false,
  addressError: null,

  order: null,
  isOrderLoading: false,
  orderError: null,

  cartProducts: [],
  isCartLoading: false,
  cartError: null,

  shippingFee: 0,
  isShippingCalculating: false,
  shippingError: null,

  // Payment method
  selectedPaymentMethod: PaymentMethod.CASH_ON_DELIVERY,

  isAddressModalOpen: false,
  isAddressFormModalOpen: false,
  editingAddress: null,
};

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Address actions
    getAddressesRequest: (state) => {
      state.isAddressLoading = true;
      state.addressError = null;
    },
    getAddressesSuccess: (state, action: PayloadAction<Address[]>) => {
      state.isAddressLoading = false;
      state.addresses = action.payload;
      state.addressError = null;
    },
    getAddressesFailure: (state, action: PayloadAction<string>) => {
      state.isAddressLoading = false;
      state.addressError = action.payload;
    },

    selectAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
    },

    createAddressRequest: (state, action: PayloadAction<Address>) => {
      state.isAddressLoading = true;
      state.addressError = null;
    },
    createAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isAddressLoading = false;
      state.addresses.push(action.payload);
      state.selectedAddress = action.payload;
      state.addressError = null;
    },
    createAddressFailure: (state, action: PayloadAction<string>) => {
      state.isAddressLoading = false;
      state.addressError = action.payload;
    },

    updateAddressRequest: (state, action: PayloadAction<Address>) => {
      state.isAddressLoading = true;
      state.addressError = null;
    },
    updateAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isAddressLoading = false;
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      if (state.selectedAddress?.id === action.payload.id) {
        state.selectedAddress = action.payload;
      }
      state.addressError = null;
    },
    updateAddressFailure: (state, action: PayloadAction<string>) => {
      state.isAddressLoading = false;
      state.addressError = action.payload;
    },

    deleteAddressRequest: (state, action: PayloadAction<number>) => {
      state.isAddressLoading = true;
      state.addressError = null;
    },
    deleteAddressSuccess: (state, action: PayloadAction<number>) => {
      state.isAddressLoading = false;
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.selectedAddress?.id === action.payload) {
        state.selectedAddress = null;
      }
      state.addressError = null;
    },
    deleteAddressFailure: (state, action: PayloadAction<string>) => {
      state.isAddressLoading = false;
      state.addressError = action.payload;
    },

    // Order actions
    createOrderRequest: (state, action: PayloadAction<CreateOrderRequest>) => {
      state.isOrderLoading = true;
      state.orderError = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isOrderLoading = false;
      state.order = action.payload;
      state.orderError = null;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isOrderLoading = false;
      state.orderError = action.payload;
    },

    // Cart actions
    setCartProducts: (state, action: PayloadAction<ProductItem[]>) => {
      state.cartProducts = action.payload;
    },
    addToCart: (state, action: PayloadAction<ProductItem>) => {
      const existingIndex = state.cartProducts.findIndex(
        item => item.detailId === action.payload.detailId
      );
      if (existingIndex !== -1) {
        state.cartProducts[existingIndex].quantity += action.payload.quantity;
      } else {
        state.cartProducts.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartProducts = state.cartProducts.filter(
        item => item.detailId !== action.payload
      );
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ detailId: number; quantity: number }>) => {
      const item = state.cartProducts.find(item => item.detailId === action.payload.detailId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cartProducts = [];
    },

    // Shipping actions
    calculateShippingRequest: (state) => {
      state.isShippingCalculating = true;
      state.shippingError = null;
    },
    calculateShippingSuccess: (state, action: PayloadAction<number>) => {
      state.isShippingCalculating = false;
      state.shippingFee = action.payload;
      state.shippingError = null;
    },
    calculateShippingFailure: (state, action: PayloadAction<string>) => {
      state.isShippingCalculating = false;
      state.shippingError = action.payload;
    },

    // UI actions
    openAddressModal: (state) => {
      state.isAddressModalOpen = true;
    },
    closeAddressModal: (state) => {
      state.isAddressModalOpen = false;
    },
    openAddressFormModal: (state, action: PayloadAction<Address | null>) => {
      state.isAddressFormModalOpen = true;
      state.editingAddress = action.payload;
    },
    closeAddressFormModal: (state) => {
      state.isAddressFormModalOpen = false;
      state.editingAddress = null;
    },

    // Payment method actions
    selectPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },

    // Reset actions
    resetOrder: (state) => {
      // Preserve selectedAddress and addresses when resetting order
      const preservedAddress = state.selectedAddress;
      const preservedAddresses = state.addresses;
      
      return { 
        ...initialState,
        selectedAddress: preservedAddress,
        addresses: preservedAddresses
      };
    },
    resetOrderState: (state) => {
      state.order = null;
      state.orderError = null;
      state.isOrderLoading = false;
    },
  },
});

// Export actions
export const {
  // Address actions
  getAddressesRequest,
  getAddressesSuccess,
  getAddressesFailure,
  selectAddress,
  createAddressRequest,
  createAddressSuccess,
  createAddressFailure,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,

  // Order actions
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,

  // Cart actions
  setCartProducts,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,

  // Shipping actions
  calculateShippingRequest,
  calculateShippingSuccess,
  calculateShippingFailure,

  // UI actions
  openAddressModal,
  closeAddressModal,
  openAddressFormModal,
  closeAddressFormModal,

  // Payment method actions
  selectPaymentMethod,

  // Reset actions
  resetOrder,
  resetOrderState,
} = orderSlice.actions;

// Selectors
export const selectAddresses = (state: { order: OrderState }) => state.order.addresses;
export const selectSelectedAddress = (state: { order: OrderState }) => state.order.selectedAddress;
export const selectIsAddressLoading = (state: { order: OrderState }) => state.order.isAddressLoading;
export const selectAddressError = (state: { order: OrderState }) => state.order.addressError;

export const selectOrder = (state: { order: OrderState }) => state.order.order;
export const selectIsOrderLoading = (state: { order: OrderState }) => state.order.isOrderLoading;
export const selectOrderError = (state: { order: OrderState }) => state.order.orderError;

export const selectCartProducts = (state: { order: OrderState }) => state.order.cartProducts;
export const selectIsCartLoading = (state: { order: OrderState }) => state.order.isCartLoading;
export const selectCartError = (state: { order: OrderState }) => state.order.cartError;

export const selectShippingFee = (state: { order: OrderState }) => state.order.shippingFee;
export const selectIsShippingCalculating = (state: { order: OrderState }) => state.order.isShippingCalculating;
export const selectShippingError = (state: { order: OrderState }) => state.order.shippingError;

export const selectSelectedPaymentMethod = (state: { order: OrderState }) => state.order.selectedPaymentMethod;

export const selectIsAddressModalOpen = (state: { order: OrderState }) => state.order.isAddressModalOpen;
export const selectIsAddressFormModalOpen = (state: { order: OrderState }) => state.order.isAddressFormModalOpen;
export const selectEditingAddress = (state: { order: OrderState }) => state.order.editingAddress;

// Export reducer
export default orderSlice.reducer;
