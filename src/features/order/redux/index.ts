// Redux exports for order feature
export { default as orderReducer } from './orderSlice';
export { orderSaga } from './orderSaga';

// Actions
export {
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
} from './orderSlice';

// Selectors
export {
  selectAddresses,
  selectSelectedAddress,
  selectIsAddressLoading,
  selectAddressError,
  selectOrder,
  selectIsOrderLoading,
  selectOrderError,
  selectCartProducts,
  selectIsCartLoading,
  selectCartError,
  selectShippingFee,
  selectIsShippingCalculating,
  selectShippingError,
  selectSelectedPaymentMethod,
  selectIsAddressModalOpen,
  selectIsAddressFormModalOpen,
  selectEditingAddress,
} from './orderSlice';
