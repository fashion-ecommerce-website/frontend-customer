// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;
import { PayloadAction } from '@reduxjs/toolkit';
import { productApi, ProductDetail } from '@/services/api/productApi';
import { ApiResponse } from '@/types/api.types';
import {
  fetchProductRequest,
  fetchProductSuccess,
  fetchProductFailure,
  fetchProductByColorRequest,
  fetchProductByColorSuccess,
  fetchProductByColorFailure,
} from './productDetailSlice';

// Worker saga: fetch product by ID
function* fetchProductSaga(action: PayloadAction<string>) {
  try {
    const productId = action.payload;
    
    // Call API
    const response: ApiResponse<ProductDetail> = yield call(productApi.getProductById, productId)
    
    if (response.success && response.data) {
      yield put(fetchProductSuccess(response.data));
    } else {
      yield put(fetchProductFailure(response.message || 'Failed to fetch product'));
    }
  } catch (error: unknown) {
    console.error('fetchProductSaga error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching product';
    yield put(fetchProductFailure(errorMessage));
  }
}

// Worker saga: fetch product by color
function* fetchProductByColorSaga(action: PayloadAction<{ id: string; color: string; size?: string }>) {
  try {
    const { id, color, size } = action.payload;
    // Call API
    const response: ApiResponse<ProductDetail> = yield call(productApi.getProductByColor, id, color, size);
    
    if (response.success && response.data) {
      yield put(fetchProductByColorSuccess(response.data));
    } else {
      yield put(fetchProductByColorFailure(response.message || 'Failed to fetch product color variant'));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching product color variant';
    yield put(fetchProductByColorFailure(errorMessage));
  }
}

// Watcher saga: watch for product detail actions
export function* productDetailSaga() {
  yield takeLatest(fetchProductRequest.type, fetchProductSaga);
  yield takeLatest(fetchProductByColorRequest.type, fetchProductByColorSaga);
}

export default productDetailSaga;