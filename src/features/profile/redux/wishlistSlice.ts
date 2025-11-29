import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem } from '@/services/api/wishlistApi';

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetchWishlistRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWishlistSuccess(state, action: PayloadAction<WishlistItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleWishlistRequest(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    toggleWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearWishlistRequest(state) {
      state.loading = true;
      state.error = null;
    },
    clearWishlistSuccess(state) {
      state.loading = false;
      state.items = [];
    },
    clearWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  toggleWishlistRequest,
  toggleWishlistFailure,
  clearWishlistRequest,
  clearWishlistSuccess,
  clearWishlistFailure,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

import { RootState } from '@/store/rootReducer';

export const selectWishlistState = (state: RootState) => state.wishlist;
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistLoading = (state: RootState) => state.wishlist.loading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;


