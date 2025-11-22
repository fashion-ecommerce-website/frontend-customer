// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

import { PayloadAction } from '@reduxjs/toolkit';
import { addressApi, Address, CreateAddressRequest, UpdateAddressRequest } from '@/services/api/addressApi';
import { OrderApi } from '@/services/api/orderApi';
import { Order, CreateOrderRequest, PaginatedResponse, OrderQueryParams } from '@/features/order/types';
import { ApiResponse } from '@/types/api.types';
import { recommendationApi, ActionType } from '@/services/api/recommendationApi';
import { productApi } from '@/services/api/productApi';
import {
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
  getUserOrdersRequest,
  getUserOrdersSuccess,
  getUserOrdersFailure,
} from './orderSlice';

// Address sagas
function* getAddressesSaga(): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address[]> = yield call(addressApi.getAddresses);

    if (response.success && response.data) {
      yield put(getAddressesSuccess(response.data));

      // Auto-select default address if available
      const defaultAddress = response.data.find(addr => addr.isDefault || addr.default);
      if (defaultAddress) {
        yield put(selectAddress(defaultAddress));
      }
    } else {
      yield put(getAddressesFailure(response.message || 'Failed to load addresses'));
    }
  } catch (error: any) {
    console.error('getAddressesSaga error:', error);
    yield put(getAddressesFailure(error?.message || 'Failed to load addresses'));
  }
}

function* createAddressSaga(action: PayloadAction<CreateAddressRequest>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.createAddress, action.payload);

    if (response.success && response.data) {
      yield put(createAddressSuccess(response.data));
    } else {
      yield put(createAddressFailure(response.message || 'Failed to create address'));
    }
  } catch (error: any) {
    console.error('createAddressSaga error:', error);
    yield put(createAddressFailure(error?.message || 'Failed to create address'));
  }
}

function* updateAddressSaga(action: PayloadAction<UpdateAddressRequest>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.updateAddress, action.payload);

    if (response.success && response.data) {
      yield put(updateAddressSuccess(response.data));
    } else {
      yield put(updateAddressFailure(response.message || 'Failed to update address'));
    }
  } catch (error: any) {
    console.error('updateAddressSaga error:', error);
    yield put(updateAddressFailure(error?.message || 'Failed to update address'));
  }
}

function* deleteAddressSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const response: ApiResponse<void> = yield call(addressApi.deleteAddress, action.payload);

    if (response.success) {
      yield put(deleteAddressSuccess(action.payload));
    } else {
      yield put(deleteAddressFailure(response.message || 'Failed to delete address'));
    }
  } catch (error: any) {
    console.error('deleteAddressSaga error:', error);
    yield put(deleteAddressFailure(error?.message || 'Failed to delete address'));
  }
}

// Order sagas
function* createOrderSaga(action: PayloadAction<CreateOrderRequest>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Order> = yield call(OrderApi.createOrder, action.payload);

    if (response.success && response.data) {
      yield put(createOrderSuccess(response.data));

      // Record PURCHASE interactions for all order items
      try {
        const order = response.data;
        console.log('📦 Recording PURCHASE interactions for order:', order.id);

        // Fetch productId for each order item and record interactions sequentially
        for (const item of order.orderDetails) {
          try {
            // Fetch product detail to get productId
            const productResponse: ApiResponse<any> = yield call(
              productApi.getProductById,
              item.productDetailId.toString()
            );

            if (productResponse.success && productResponse.data) {
              const productId = productResponse.data.productId;

              // Record PURCHASE interaction with productId
              yield call(
                recommendationApi.recordInteraction,
                productId,
                ActionType.PURCHASE,
                item.quantity
              );

              console.log(`✅ Recorded PURCHASE for product ${productId}, quantity ${item.quantity}`);
            }
          } catch (error) {
            console.error(`❌ Failed to record PURCHASE for detailId ${item.productDetailId}:`, error);
            // Continue with other items even if one fails
          }
        }

        console.log('✅ Completed recording PURCHASE interactions for all items');
      } catch (error) {
        console.error('❌ Failed to record PURCHASE interactions:', error);
        // Fail silently - don't break order flow
      }
    } else {
      yield put(createOrderFailure(response.message || 'Failed to create order'));
    }
  } catch (error: any) {
    console.error('createOrderSaga error:', error);
    yield put(createOrderFailure(error?.message || 'Failed to create order'));
  }
}

function* getUserOrdersSaga(action: PayloadAction<OrderQueryParams | undefined>): Generator<any, void, any> {
  try {
    const response: ApiResponse<PaginatedResponse<Order>> = yield call(OrderApi.getUserOrders, action.payload);

    if (response.success && response.data) {
      yield put(getUserOrdersSuccess(response.data));
    } else {
      yield put(getUserOrdersFailure(response.message || 'Failed to load orders'));
    }
  } catch (error: any) {
    console.error('getUserOrdersSaga error:', error);
    yield put(getUserOrdersFailure(error?.message || 'Failed to load orders'));
  }
}

// Root order saga
export function* orderSaga(): Generator<any, void, any> {
  // Address sagas
  yield takeLatest(getAddressesRequest.type, getAddressesSaga);
  yield takeLatest(createAddressRequest.type, createAddressSaga);
  yield takeLatest(updateAddressRequest.type, updateAddressSaga);
  yield takeLatest(deleteAddressRequest.type, deleteAddressSaga);

  // Order sagas
  yield takeLatest(createOrderRequest.type, createOrderSaga);
  yield takeLatest(getUserOrdersRequest.type, getUserOrdersSaga);
}

export default orderSaga;
