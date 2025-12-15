import { PayloadAction } from '@reduxjs/toolkit';
import type { RefundQueryParams } from '../types/refund.types';
import { RefundApi } from '@/services/api/refundApi';
import {
  fetchRefundsRequest,
  fetchRefundsSuccess,
  fetchRefundsFailure,
  createRefundRequest,
  createRefundSuccess,
  createRefundFailure,
} from './refundSlice';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest, select } = effects;

// ===== FETCH REFUNDS SAGA =====
function* handleFetchRefunds(action: PayloadAction<RefundQueryParams | undefined>): Generator {
  try {
    // Get current query from state and merge with action payload
    const currentQuery: RefundQueryParams = yield select(
      (state: { refund: { query: RefundQueryParams } }) => state.refund.query
    );
    
    const query = action.payload ? { ...currentQuery, ...action.payload } : currentQuery;
    
    const response = yield call([RefundApi, 'getCurrentUserRefunds'], {
      page: query.page,
      size: query.size,
      status: query.status,
    });

    if (response.success && response.data) {
      yield put(fetchRefundsSuccess({
        content: response.data.content || [],
        totalPages: response.data.totalPages || 1,
        totalElements: response.data.totalElements || 0,
        number: response.data.number || 0,
      }));
    } else {
      yield put(fetchRefundsFailure(response.message || 'Failed to fetch refund requests'));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch refund requests';
    yield put(fetchRefundsFailure(errorMessage));
  }
}

// ===== CREATE REFUND SAGA =====
function* handleCreateRefund(
  action: PayloadAction<{ orderId: number; reason: string; refundAmount: number }>
): Generator {
  try {
    const { orderId, reason, refundAmount } = action.payload;
    
    const response = yield call([RefundApi, 'createRefund'], {
      orderId,
      reason,
      refundAmount,
    });

    if (response.success && response.data) {
      yield put(createRefundSuccess(response.data));
      // Refresh the refund list after creating
      yield put(fetchRefundsRequest(undefined));
    } else {
      yield put(createRefundFailure(response.message || 'Failed to create refund request'));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create refund request';
    yield put(createRefundFailure(errorMessage));
  }
}

// ===== ROOT SAGA =====
export function* refundSaga(): Generator {
  yield takeLatest(fetchRefundsRequest.type, handleFetchRefunds);
  yield takeLatest(createRefundRequest.type, handleCreateRefund);
}

export default refundSaga;
