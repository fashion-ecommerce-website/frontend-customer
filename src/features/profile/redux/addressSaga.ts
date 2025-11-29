import { PayloadAction } from '@reduxjs/toolkit';
import { addressApi, CreateAddressRequest, UpdateAddressRequest, Address } from '../../../services/api/addressApi';
import { ApiResponse, ApiError } from '../../../types/api.types';
import {
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
} from './addressSlice';

// Use require for redux-saga effects to avoid type issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

// Worker saga: Get addresses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getAddressesSaga(): Generator<any, void, any> {
  try {
    console.log('AddressSaga: Starting getAddresses request...');
    const response: ApiResponse<Address[]> = yield call(addressApi.getAddresses);
    console.log('AddressSaga: API response:', response);
    
    if (response.success && response.data) {
      console.log('AddressSaga: Success - addresses received:', response.data);
      yield put(getAddressesSuccess(response.data));
    } else {
      console.log('AddressSaga: API request failed:', response.message);
      const error: ApiError = {
        message: response.message || 'Failed to fetch addresses',
        status: 500,
      };
      yield put(getAddressesFailure(error));
    }
  } catch (error) {
    console.error('AddressSaga: Exception caught:', error);
    const apiError: ApiError = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    };
    yield put(getAddressesFailure(apiError));
  }
}

// Worker saga: Create address
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* createAddressSaga(action: PayloadAction<CreateAddressRequest>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.createAddress, action.payload);
    
    if (response.success && response.data) {
      yield put(createAddressSuccess(response.data));
      // Refresh the addresses list
      yield put(getAddressesRequest());
    } else {
      const error: ApiError = {
        message: response.message || 'Failed to create address',
        status: 500,
      };
      yield put(createAddressFailure(error));
    }
  } catch (error) {
    const apiError: ApiError = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    };
    yield put(createAddressFailure(apiError));
  }
}

// Worker saga: Update address
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* updateAddressSaga(action: PayloadAction<UpdateAddressRequest>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.updateAddress, action.payload);
    
    if (response.success && response.data) {
      yield put(updateAddressSuccess(response.data));
      // Refresh the addresses list
      yield put(getAddressesRequest());
    } else {
      const error: ApiError = {
        message: response.message || 'Failed to update address',
        status: 500,
      };
      yield put(updateAddressFailure(error));
    }
  } catch (error) {
    const apiError: ApiError = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    };
    yield put(updateAddressFailure(apiError));
  }
}

// Worker saga: Delete address
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* deleteAddressSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const response: ApiResponse<void> = yield call(addressApi.deleteAddress, action.payload);
    
    if (response.success) {
      yield put(deleteAddressSuccess(action.payload));
    } else {
      const error: ApiError = {
        message: response.message || 'Failed to delete address',
        status: 500,
      };
      yield put(deleteAddressFailure(error));
    }
  } catch (error) {
    const apiError: ApiError = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    };
    yield put(deleteAddressFailure(apiError));
  }
}

// Worker saga: Set default address
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* setDefaultAddressSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const response: ApiResponse<Address> = yield call(addressApi.setDefaultAddress, action.payload);
    
    if (response.success && response.data) {
      yield put(setDefaultAddressSuccess(response.data));
      // Refresh the addresses list to ensure consistency
      yield put(getAddressesRequest());
    } else {
      const error: ApiError = {
        message: response.message || 'Failed to set default address',
        status: 500,
      };
      yield put(setDefaultAddressFailure(error));
    }
  } catch (error) {
    const apiError: ApiError = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    };
    yield put(setDefaultAddressFailure(apiError));
  }
}

// Watcher saga
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* addressSaga(): Generator<any, void, any> {
  yield takeLatest(getAddressesRequest.type, getAddressesSaga);
  yield takeLatest(createAddressRequest.type, createAddressSaga);
  yield takeLatest(updateAddressRequest.type, updateAddressSaga);
  yield takeLatest(deleteAddressRequest.type, deleteAddressSaga);
  yield takeLatest(setDefaultAddressRequest.type, setDefaultAddressSaga);
}

export default addressSaga;