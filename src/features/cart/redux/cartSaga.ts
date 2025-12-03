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
  removeCartItems,
  setError
} from './cartSlice';

// Action types
export const CART_ACTIONS = {
  FETCH_CART: 'cart/fetchCart',
  ADD_TO_CART: 'cart/addToCart',
  // Use a distinct async action type to avoid colliding with the slice reducer's
  // `updateCartItem` action (which shares the same type string when generated
  // by the slice). If they share the same type string the saga and reducer
  // can trigger each other leading to duplicate API calls.
  UPDATE_CART_ITEM: 'cart/updateCartItemAsync',
  // Use a distinct async action type for remove to avoid colliding with
  // the slice reducer's `removeCartItem` action which has the same
  // type string. When they share the same type the saga and reducer
  // can trigger each other leading to duplicate API calls.
  REMOVE_CART_ITEM: 'cart/removeCartItemAsync',
  REMOVE_MULTIPLE_CART_ITEMS: 'cart/removeMultipleCartItemsAsync',
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
export const removeMultipleCartItemsAsync = (cartItemIds: number[]) => ({
  type: CART_ACTIONS.REMOVE_MULTIPLE_CART_ITEMS,
  payload: cartItemIds
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
  } catch {
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
      // Fetch cart again to get promotion data
      const cartResponse: ApiResponse<CartItem[]> = yield call(cartApi.getCartItems);
      if (cartResponse.success && cartResponse.data) {
        yield put(setCartItems(cartResponse.data));
      }
    } else {
      yield put(setError(response.message || 'Failed to add item to cart'));
    }
  } catch {
    yield put(setError('Network error occurred while adding to cart'));
  } finally {
    yield put(setLoading(false));
  }
}

function* updateCartItemSaga(action: PayloadAction<UpdateCartItemPayload>) {
  try {
    yield put(setLoading(true));
    const { cartDetailId, newProductDetailId, quantity } = action.payload;
    const request = {
      cartDetailId,
      newProductDetailId,
      quantity,
    };

    // cartApi.updateCartItem expects a single UpdateCartItemRequest object
    const response: ApiResponse<CartItem> = yield call(
      cartApi.updateCartItem,
      request
    );
    
    if (response.success && response.data) {
      yield put(updateCartItem({ cartItemId: cartDetailId, updatedItem: response.data }));
    } else {
      yield put(setError(response.message || 'Failed to update cart item'));
    }
  } catch {
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
  } catch {
    yield put(setError('Network error occurred while removing cart item'));
  } finally {
    yield put(setLoading(false));
  }
}

function* removeMultipleCartItemsSaga(action: PayloadAction<number[]>) {
  try {
    yield put(setLoading(true));
    const cartItemIds = action.payload;
    const response: ApiResponse<void> = yield call(cartApi.removeMultipleCartItems, cartItemIds);
    if (response.success) {
      yield put(removeCartItems(cartItemIds));
    } else {
      yield put(setError(response.message || 'Failed to remove selected cart items'));
    }
  } catch {
    yield put(setError('Network error occurred while removing selected cart items'));
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
  } catch {
    yield put(setError('Network error occurred while clearing cart'));
  } finally {
    yield put(setLoading(false));
  }
}

// Root cart saga
export function* cartSaga() {
  yield takeLatest(CART_ACTIONS.FETCH_CART, fetchCartSaga);
  yield takeEvery(CART_ACTIONS.ADD_TO_CART, addToCartSaga);
  // Use takeLatest so if the update action is dispatched multiple times
  // (for example due to UI duplicate events or HMR/dev double-invocation),
  // only the most recent update will be processed and previous ones will be cancelled.
  yield takeLatest(CART_ACTIONS.UPDATE_CART_ITEM, updateCartItemSaga);
  // Process every remove action so multiple selected items can be removed sequentially
  yield takeEvery(CART_ACTIONS.REMOVE_CART_ITEM, removeCartItemSaga);
  yield takeLatest(CART_ACTIONS.REMOVE_MULTIPLE_CART_ITEMS, removeMultipleCartItemsSaga);
  yield takeLatest(CART_ACTIONS.CLEAR_CART, clearCartSaga);
}