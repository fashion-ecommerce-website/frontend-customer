/**
 * Review Redux Slice
 * Manages review state for profile feature
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewFormData, ApiError } from '../types/profile.types';

export interface ReviewState {
  reviews: Review[];
  totalReviews: number; // Total number of reviews across all pages
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  submitSuccess: boolean;
  // Pagination state
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  // Delete confirmation modal
  confirmDelete: { reviewId: string; productName: string } | null;
}

const initialState: ReviewState = {
  reviews: [],
  totalReviews: 0,
  isLoading: false,
  isSubmitting: false,
  error: null,
  submitSuccess: false,
  // Pagination initial state
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  // Delete confirmation modal
  confirmDelete: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // Get reviews
    getReviewsRequest: (state, action: PayloadAction<{ page?: number }>) => {
      state.isLoading = true;
      state.error = null;
      state.currentPage = action.payload?.page || 1;
    },
    getReviewsSuccess: (state, action: PayloadAction<{ reviews: Review[]; totalReviews: number; totalPages: number; hasNext: boolean; hasPrevious: boolean }>) => {
      state.isLoading = false;
      state.reviews = action.payload.reviews;
      state.totalReviews = action.payload.totalReviews;
      state.totalPages = action.payload.totalPages;
      state.hasNext = action.payload.hasNext;
      state.hasPrevious = action.payload.hasPrevious;
      state.error = null;
    },
    getReviewsFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update review
    updateReviewRequest: (state, action: PayloadAction<{ reviewId: string; data: ReviewFormData }>) => {
      state.isSubmitting = true;
      state.error = null;
    },
    updateReviewSuccess: (state, action: PayloadAction<Review>) => {
      state.isSubmitting = false;
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
      state.submitSuccess = true;
      state.error = null;
    },
    updateReviewFailure: (state, action: PayloadAction<ApiError>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    // Delete review
    deleteReviewRequest: (state, action: PayloadAction<string>) => {
      state.isSubmitting = true;
      state.error = null;
    },
    deleteReviewSuccess: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.reviews = state.reviews.filter(review => review.id !== action.payload);
      state.totalReviews = Math.max(0, state.totalReviews - 1); // Decrease total count
      
      // Recalculate pagination after deletion
      const limit = 5; // Same limit as in API
      const newTotalPages = Math.ceil(state.totalReviews / limit) || 1;
      
      // If current page is now empty and there are previous pages, go to previous page
      if (state.reviews.length === 0 && state.currentPage > 1) {
        state.currentPage = Math.max(1, state.currentPage - 1);
      }
      
      state.totalPages = newTotalPages;
      state.hasNext = state.currentPage < newTotalPages;
      state.hasPrevious = state.currentPage > 1;
      
      state.submitSuccess = true;
      state.error = null;
    },
    deleteReviewFailure: (state, action: PayloadAction<ApiError>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    // Delete confirmation modal
    showDeleteConfirm: (state, action: PayloadAction<{ reviewId: string; productName: string }>) => {
      state.confirmDelete = action.payload;
    },
    hideDeleteConfirm: (state) => {
      state.confirmDelete = null;
    },

    // Clear states
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.submitSuccess = false;
    },
    clearAll: (state) => {
      state.reviews = [];
      state.totalReviews = 0;
      state.isLoading = false;
      state.isSubmitting = false;
      state.error = null;
      state.submitSuccess = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasNext = false;
      state.hasPrevious = false;
      state.confirmDelete = null;
    },
  },
});

export const {
  getReviewsRequest,
  getReviewsSuccess,
  getReviewsFailure,
  updateReviewRequest,
  updateReviewSuccess,
  updateReviewFailure,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFailure,
  showDeleteConfirm,
  hideDeleteConfirm,
  clearError,
  clearSuccess,
  clearAll,
} = reviewSlice.actions;

// Selectors
export const selectReviews = (state: { review: ReviewState }) => state.review.reviews;
export const selectTotalReviews = (state: { review: ReviewState }) => state.review.totalReviews;
export const selectIsLoading = (state: { review: ReviewState }) => state.review.isLoading;
export const selectIsSubmitting = (state: { review: ReviewState }) => state.review.isSubmitting;
export const selectError = (state: { review: ReviewState }) => state.review.error;
export const selectSubmitSuccess = (state: { review: ReviewState }) => state.review.submitSuccess;
// Pagination selectors
export const selectCurrentPage = (state: { review: ReviewState }) => state.review.currentPage;
export const selectTotalPages = (state: { review: ReviewState }) => state.review.totalPages;
export const selectHasNext = (state: { review: ReviewState }) => state.review.hasNext;
export const selectHasPrevious = (state: { review: ReviewState }) => state.review.hasPrevious;
// Delete confirmation selector
export const selectConfirmDelete = (state: { review: ReviewState }) => state.review.confirmDelete;

export default reviewSlice.reducer;
