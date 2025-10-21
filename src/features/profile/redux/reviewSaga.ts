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
function* getReviewsSaga(action: PayloadAction<{ page?: number }>): Generator<any, void, any> {
  try {
    const page = action.payload?.page || 1;
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
  } catch (error: any) {
    yield put(getReviewsFailure({
      message: error.message || 'Failed to fetch reviews',
      status: error.status,
    }));
  }
}

// Update review
function* updateReviewSaga(action: PayloadAction<{ reviewId: string; data: ReviewFormData }>): Generator<any, void, any> {
  try {
    const { reviewId, data } = action.payload;
    const response: any = yield call(() => reviewApiService.updateProfileReview(reviewId, data));
    if (response.success) {
      yield put(updateReviewSuccess(response.data));
    } else {
      yield put(updateReviewFailure({
        message: response.message || 'Failed to update review',
        status: response.status,
      }));
    }
  } catch (error: any) {
    yield put(updateReviewFailure({
      message: error.message || 'Failed to update review',
      status: error.status,
    }));
  }
}

// Delete review
function* deleteReviewSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const reviewId = action.payload;
    const response: any = yield call(() => reviewApiService.deleteProfileReview(reviewId));
    if (response.success) {
      yield put(deleteReviewSuccess(reviewId));
    } else {
      yield put(deleteReviewFailure({
        message: response.message || 'Failed to delete review',
        status: response.status,
      }));
    }
  } catch (error: any) {
    yield put(deleteReviewFailure({
      message: error.message || 'Failed to delete review',
      status: error.status,
    }));
  }
}

// Watch for actions
export function* reviewSaga() {
  yield takeEvery(getReviewsRequest.type, getReviewsSaga);
  yield takeEvery(updateReviewRequest.type, updateReviewSaga);
  yield takeEvery(deleteReviewRequest.type, deleteReviewSaga);
}
