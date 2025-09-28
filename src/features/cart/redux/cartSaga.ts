// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeEvery, takeLatest } = effects;

import { PayloadAction } from '@reduxjs/toolkit';
import { cartApi, CartItem } from '@/services/api/cartApi';
import { ApiResponse } from '@/types/api.types';
import { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types';
import {
  setLoading,
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  setError
} from './cartSlice';

// Action types
export const CART_ACTIONS = {
  FETCH_CART: 'cart/fetchCart',
  ADD_TO_CART: 'cart/addToCart',
  UPDATE_CART_ITEM: 'cart/updateCartItem',
  REMOVE_CART_ITEM: 'cart/removeCartItem',
  CLEAR_CART: 'cart/clearCart'
} as const;

// Action creators
export const fetchCart = () => ({ type: CART_ACTIONS.FETCH_CART });
export const addToCartAsync = (payload: AddToCartPayload) => ({ 
  type: CART_ACTIONS.ADD_TO_CART, 
  payload 
});
export const updateCartItemAsync = (payload: UpdateCartItemPayload) => ({ 
  type: CART_ACTIONS.UPDATE_CART_ITEM, 
  payload 
});
export const removeCartItemAsync = (cartItemId: number) => ({ 
  type: CART_ACTIONS.REMOVE_CART_ITEM, 
  payload: cartItemId 
});
export const clearCartAsync = () => ({ type: CART_ACTIONS.CLEAR_CART });

// Saga workers
function* fetchCartSaga() {
  try {
    yield put(setLoading(true));
    const response: ApiResponse<CartItem[]> = yield call(cartApi.getCartItems);
    
    if (response.success && response.data) {
      yield put(setCartItems(response.data));
    } else {
      yield put(setError(response.message || 'Failed to fetch cart items'));
    }
  } catch (error) {
    yield put(setError('Network error occurred while fetching cart'));
  } finally {
    yield put(setLoading(false));
  }
}

function* addToCartSaga(action: PayloadAction<AddToCartPayload>) {
  try {
    yield put(setLoading(true));
    
    const response: ApiResponse<CartItem> = yield call(cartApi.addToCart, action.payload);
    
    if (response.success && response.data) {
      yield put(addCartItem(response.data));
    } else {
      yield put(setError(response.message || 'Failed to add item to cart'));
    }
  } catch (error) {
    yield put(setError('Network error occurred while adding to cart'));
  } finally {
    yield put(setLoading(false));
  }
}

function* updateCartItemSaga(action: PayloadAction<UpdateCartItemPayload>) {
  try {
    yield put(setLoading(true));
    const { cartItemId, quantity } = action.payload;
    const response: ApiResponse<CartItem> = yield call(
      cartApi.updateCartItem, 
      cartItemId, 
      { quantity }
    );
    
    if (response.success && response.data) {
      yield put(updateCartItem({ cartItemId, updatedItem: response.data }));
    } else {
      yield put(setError(response.message || 'Failed to update cart item'));
    }
  } catch (error) {
    yield put(setError('Network error occurred while updating cart item'));
  } finally {
    yield put(setLoading(false));
  }
}

function* removeCartItemSaga(action: PayloadAction<number>) {
  try {
    yield put(setLoading(true));
    const cartItemId = action.payload;
    
    // Call API to remove item
    const response: ApiResponse<void> = yield call(cartApi.removeCartItem, cartItemId);
    
    if (response.success) {
      // Only update local state, don't refetch entire cart
      yield put(removeCartItem(cartItemId));
    } else {
      yield put(setError(response.message || 'Failed to remove cart item'));
    }
  } catch (error) {
    yield put(setError('Network error occurred while removing cart item'));
  } finally {
    yield put(setLoading(false));
  }
}

function* clearCartSaga() {
  try {
    yield put(setLoading(true));
    const response: ApiResponse<void> = yield call(cartApi.clearCart);
    
    if (response.success) {
      yield put(clearCart());
    } else {
      yield put(setError(response.message || 'Failed to clear cart'));
    }
  } catch (error) {
    yield put(setError('Network error occurred while clearing cart'));
  } finally {
    yield put(setLoading(false));
  }
}

// Root cart saga
export function* cartSaga() {
  yield takeLatest(CART_ACTIONS.FETCH_CART, fetchCartSaga);
  yield takeEvery(CART_ACTIONS.ADD_TO_CART, addToCartSaga);
  yield takeEvery(CART_ACTIONS.UPDATE_CART_ITEM, updateCartItemSaga);
  yield takeLatest(CART_ACTIONS.REMOVE_CART_ITEM, removeCartItemSaga);
  yield takeLatest(CART_ACTIONS.CLEAR_CART, clearCartSaga);
}