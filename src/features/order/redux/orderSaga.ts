// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

import { PayloadAction } from '@reduxjs/toolkit';
import { addressApi, Address, CreateAddressRequest, UpdateAddressRequest } from '@/services/api/addressApi';
import { OrderApi } from '@/services/api/orderApi';
import { Order, CreateOrderRequest, PaginatedResponse, OrderQueryParams } from '@/features/order/types';
import { ApiResponse } from '@/types/api.types';
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
function* getAddressesSaga(): Generator {
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
  } catch (error: unknown) {
    console.error('getAddressesSaga error:', error);
    yield put(getAddressesFailure(error instanceof Error ? error.message : 'Failed to load addresses'));
  }
}

function* createAddressSaga(action: PayloadAction<CreateAddressRequest>): Generator {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.createAddress, action.payload);

    if (response.success && response.data) {
      yield put(createAddressSuccess(response.data));
    } else {
      yield put(createAddressFailure(response.message || 'Failed to create address'));
    }
  } catch (error: unknown) {
    console.error('createAddressSaga error:', error);
    yield put(createAddressFailure(error instanceof Error ? error.message : 'Failed to create address'));
  }
}

function* updateAddressSaga(action: PayloadAction<UpdateAddressRequest>): Generator {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.updateAddress, action.payload);

    if (response.success && response.data) {
      yield put(updateAddressSuccess(response.data));
    } else {
      yield put(updateAddressFailure(response.message || 'Failed to update address'));
    }
  } catch (error: unknown) {
    console.error('updateAddressSaga error:', error);
    yield put(updateAddressFailure(error instanceof Error ? error.message : 'Failed to update address'));
  }
}

function* deleteAddressSaga(action: PayloadAction<number>): Generator {
  try {
    const response: ApiResponse<void> = yield call(addressApi.deleteAddress, action.payload);

    if (response.success) {
      yield put(deleteAddressSuccess(action.payload));
    } else {
      yield put(deleteAddressFailure(response.message || 'Failed to delete address'));
    }
  } catch (error: unknown) {
    console.error('deleteAddressSaga error:', error);
    yield put(deleteAddressFailure(error instanceof Error ? error.message : 'Failed to delete address'));
  }
}

// Order sagas
function* createOrderSaga(action: PayloadAction<CreateOrderRequest>): Generator {
  try {
    const response: ApiResponse<Order> = yield call(OrderApi.createOrder, action.payload);

    if (response.success && response.data) {
      yield put(createOrderSuccess(response.data));
      // Note: PURCHASE intent is now tracked when user clicks checkout button in cart
      // No need to track again here to avoid duplicate tracking
    } else {
      yield put(createOrderFailure(response.message || 'Failed to create order'));
    }
  } catch (error: unknown) {
    console.error('createOrderSaga error:', error);
    yield put(createOrderFailure(error instanceof Error ? error.message : 'Failed to create order'));
  }
}

function* getUserOrdersSaga(action: PayloadAction<OrderQueryParams | undefined>): Generator {
  try {
    const response: ApiResponse<PaginatedResponse<Order>> = yield call(OrderApi.getUserOrders, action.payload);

    if (response.success && response.data) {
      yield put(getUserOrdersSuccess(response.data));
    } else {
      yield put(getUserOrdersFailure(response.message || 'Failed to load orders'));
    }
  } catch (error: unknown) {
    console.error('getUserOrdersSaga error:', error);
    yield put(getUserOrdersFailure(error instanceof Error ? error.message : 'Failed to load orders'));
  }
}

// Root order saga
export function* orderSaga(): Generator {
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
