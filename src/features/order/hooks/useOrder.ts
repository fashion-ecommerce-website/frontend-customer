import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '@/services/api/addressApi';
import { CreateOrderRequest } from '../types';
import { ProductItem } from '@/services/api/productApi';
import { PaymentMethod } from '../types';
import {
  // Address actions
  getAddressesRequest,
  selectAddress,
  createAddressRequest,
  updateAddressRequest,
  deleteAddressRequest,
  openAddressModal,
  closeAddressModal,
  openAddressFormModal,
  closeAddressFormModal,

  // Payment method actions
  selectPaymentMethod,

  // Order actions
  createOrderRequest,
  resetOrder,

  // Cart actions
  setCartProducts,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,

  // Selectors
  selectAddresses,
  selectSelectedAddress,
  selectIsAddressLoading,
  selectAddressError,
  selectOrder,
  selectIsOrderLoading,
  selectOrderError,
  selectCartProducts,
  selectSelectedPaymentMethod,
  selectIsAddressModalOpen,
  selectIsAddressFormModalOpen,
  selectEditingAddress,
} from '../redux/orderSlice';

/**
 * Custom hook for order functionality using Redux
 */
export const useOrder = () => {
  const dispatch = useDispatch();

  // Selectors
  const addresses = useSelector(selectAddresses);
  const selectedAddress = useSelector(selectSelectedAddress);
  const isAddressLoading = useSelector(selectIsAddressLoading);
  const addressError = useSelector(selectAddressError);
  const order = useSelector(selectOrder);
  const isOrderLoading = useSelector(selectIsOrderLoading);
  const orderError = useSelector(selectOrderError);
  const cartProducts = useSelector(selectCartProducts);
  const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod);
  const isAddressModalOpen = useSelector(selectIsAddressModalOpen);
  const isAddressFormModalOpen = useSelector(selectIsAddressFormModalOpen);
  const editingAddress = useSelector(selectEditingAddress);

  // Address actions
  const loadAddresses = useCallback(() => {
    dispatch(getAddressesRequest());
  }, [dispatch]);

  const selectAddressAction = useCallback((address: Address) => {
    dispatch(selectAddress(address));
  }, [dispatch]);

  const createAddress = useCallback((addressData: CreateAddressRequest) => {
    dispatch(createAddressRequest(addressData));
  }, [dispatch]);

  const updateAddress = useCallback((addressData: UpdateAddressRequest) => {
    dispatch(updateAddressRequest(addressData));
  }, [dispatch]);

  const deleteAddress = useCallback((addressId: number) => {
    dispatch(deleteAddressRequest(addressId));
  }, [dispatch]);

  // Modal actions
  const openAddressListModal = useCallback(() => {
    dispatch(openAddressModal());
  }, [dispatch]);

  const closeAddressListModal = useCallback(() => {
    dispatch(closeAddressModal());
  }, [dispatch]);

  const openAddressFormModalAction = useCallback((address: Address | null = null) => {
    dispatch(openAddressFormModal(address));
  }, [dispatch]);

  const closeAddressFormModalAction = useCallback(() => {
    dispatch(closeAddressFormModal());
  }, [dispatch]);

  // Payment method actions
  const selectPaymentMethodAction = useCallback((paymentMethod: PaymentMethod) => {
    dispatch(selectPaymentMethod(paymentMethod));
  }, [dispatch]);

  // Order actions
  const createOrder = useCallback((orderData: CreateOrderRequest) => {
    dispatch(createOrderRequest(orderData));
  }, [dispatch]);

  const resetOrderState = useCallback(() => {
    dispatch(resetOrder());
  }, [dispatch]);

  // Cart actions
  const setCart = useCallback((products: ProductItem[]) => {
    dispatch(setCartProducts(products));
  }, [dispatch]);

  const addToCartAction = useCallback((product: ProductItem) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  const removeFromCartAction = useCallback((detailId: number) => {
    dispatch(removeFromCart(detailId));
  }, [dispatch]);

  const updateCartItemQuantityAction = useCallback((detailId: number, quantity: number) => {
    dispatch(updateCartItemQuantity({ detailId, quantity }));
  }, [dispatch]);

  const clearCartAction = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    // State
    addresses,
    selectedAddress,
    isAddressLoading,
    addressError,
    order,
    isOrderLoading,
    orderError,
    cartProducts,
    selectedPaymentMethod,
    isAddressModalOpen,
    isAddressFormModalOpen,
    editingAddress,

    // Address actions
    loadAddresses,
    selectAddress: selectAddressAction,
    createAddress,
    updateAddress,
    deleteAddress,

    // Modal actions
    openAddressListModal,
    closeAddressListModal,
    openAddressFormModal: openAddressFormModalAction,
    closeAddressFormModal: closeAddressFormModalAction,

    // Payment method actions
    selectPaymentMethod: selectPaymentMethodAction,

    // Order actions
    createOrder,
    resetOrder: resetOrderState,

    // Cart actions
    setCart,
    addToCart: addToCartAction,
    removeFromCart: removeFromCartAction,
    updateCartItemQuantity: updateCartItemQuantityAction,
    clearCart: clearCartAction,
  };
};
