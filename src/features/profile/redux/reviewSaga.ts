/**
 * Review Redux Saga
 * Handles async operations for review management
 */

import { call, put } from 'redux-saga/effects';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { takeEvery } = require('redux-saga/effects');
import { PayloadAction } from '@reduxjs/toolkit';
import { reviewApiService } from '../../../services/api/reviewApi';
import { ReviewFormData } from '../types/profile.types';
import {
  getReviewsRequest,
  getReviewsSuccess,
  getReviewsFailure,
  updateReviewRequest,
  updateReviewSuccess,
  updateReviewFailure,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFailure,
} from './reviewSlice';

// Get user's reviews
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getReviewsSaga(action: PayloadAction<{ page?: number }>): Generator<any, void, any> {
  try {
    const page = action.payload?.page || 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = yield call(() => reviewApiService.getMyProfileReviews(page));
    if (response.success) {
      yield put(getReviewsSuccess({
        reviews: response.data.reviews,
        totalReviews: response.data.totalReviews || response.data.reviews.length,
        totalPages: response.data.totalPages,
        hasNext: response.data.hasNext,
        hasPrevious: response.data.hasPrevious,
      }));
    } else {
      yield put(getReviewsFailure({
        message: response.message || 'Failed to fetch reviews',
        status: response.status,
      }));
    }
  } catch (error) {
    yield put(getReviewsFailure({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Network error occurred',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status || 500,
    }));
  }
}

// Update review
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* updateReviewSaga(action: PayloadAction<{ reviewId: string; data: ReviewFormData }>): Generator<any, void, any> {
  try {
    const { reviewId, data } = action.payload;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = yield call(() => reviewApiService.updateProfileReview(reviewId, data));
    if (response.success) {
      yield put(updateReviewSuccess(response.data));
    } else {
      yield put(updateReviewFailure({
        message: response.message || 'Failed to update review',
        status: response.status,
      }));
    }
  } catch (error) {
    yield put(updateReviewFailure({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Failed to update review',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status,
    }));
  }
}

// Delete review
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* deleteReviewSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const reviewId = action.payload;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = yield call(() => reviewApiService.deleteProfileReview(reviewId));
    if (response.success) {
      yield put(deleteReviewSuccess(reviewId));
    } else {
      yield put(deleteReviewFailure({
        message: response.message || 'Failed to delete review',
        status: response.status,
      }));
    }
  } catch (error) {
    yield put(deleteReviewFailure({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message || 'Failed to delete review',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (error as any).status,
    }));
  }
}

// Watch for actions
export function* reviewSaga() {
  yield takeEvery(getReviewsRequest.type, getReviewsSaga);
  yield takeEvery(updateReviewRequest.type, updateReviewSaga);
  yield takeEvery(deleteReviewRequest.type, deleteReviewSaga);
}
