import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RefundItem, RefundStatus, RefundQueryParams } from '../types/refund.types';
import { RootState } from '../../../store/rootReducer';

export interface RefundState {
  // List
  refunds: RefundItem[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  
  // Query
  query: RefundQueryParams;
  
  // Create refund
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
}

const initialState: RefundState = {
  refunds: [],
  loading: false,
  error: null,
  
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
  
  query: {
    page: 0,
    size: 10,
  },
  
  createLoading: false,
  createError: null,
  createSuccess: false,
};

const refundSlice = createSlice({
  name: 'refund',
  initialState,
  reducers: {
    // ===== FETCH REFUNDS =====
    fetchRefundsRequest: (state, action: PayloadAction<RefundQueryParams | undefined>) => {
      state.loading = true;
      state.error = null;
      if (action.payload) {
        state.query = { ...state.query, ...action.payload };
      }
    },
    fetchRefundsSuccess: (state, action: PayloadAction<{
      content: RefundItem[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>) => {
      state.loading = false;
      state.refunds = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.number + 1; // API is 0-indexed
      state.error = null;
    },
    fetchRefundsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.refunds = [];
    },
    
    // ===== CREATE REFUND =====
    createRefundRequest: (state, _action: PayloadAction<{
      orderId: number;
      reason: string;
      refundAmount: number;
    }>) => {
      void _action; // Saga handles the payload
      state.createLoading = true;
      state.createError = null;
      state.createSuccess = false;
    },
    createRefundSuccess: (state, _action: PayloadAction<RefundItem>) => {
      void _action; // Success indicator only, saga refetches list
      state.createLoading = false;
      state.createSuccess = true;
      state.createError = null;
    },
    createRefundFailure: (state, action: PayloadAction<string>) => {
      state.createLoading = false;
      state.createError = action.payload;
      state.createSuccess = false;
    },
    
    // ===== FILTER & PAGINATION =====
    setFilter: (state, action: PayloadAction<RefundStatus | undefined>) => {
      state.query.status = action.payload;
      state.query.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.query.page = action.payload - 1; // Convert to 0-indexed
      state.currentPage = action.payload;
    },
    
    // ===== RESET =====
    resetCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    resetState: () => initialState,
  },
});

// Export actions
export const {
  fetchRefundsRequest,
  fetchRefundsSuccess,
  fetchRefundsFailure,
  createRefundRequest,
  createRefundSuccess,
  createRefundFailure,
  setFilter,
  setPage,
  resetCreateState,
  resetState,
} = refundSlice.actions;

// Selectors
export const selectRefunds = (state: RootState) => state.refund.refunds;
export const selectRefundsLoading = (state: RootState) => state.refund.loading;
export const selectRefundsError = (state: RootState) => state.refund.error;
export const selectCurrentPage = (state: RootState) => state.refund.currentPage;
export const selectTotalPages = (state: RootState) => state.refund.totalPages;
export const selectQuery = (state: RootState) => state.refund.query;
export const selectCreateLoading = (state: RootState) => state.refund.createLoading;
export const selectCreateError = (state: RootState) => state.refund.createError;
export const selectCreateSuccess = (state: RootState) => state.refund.createSuccess;

// Export reducer
export const refundReducer = refundSlice.reducer;
export default refundReducer;
