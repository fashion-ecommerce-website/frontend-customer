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
  },
});

export const {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  toggleWishlistRequest,
  toggleWishlistSuccess,
  toggleWishlistFailure,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

export const selectWishlistState = (state: any) => state.wishlist as WishlistState;
export const selectWishlistItems = (state: any) => (state.wishlist as WishlistState).items;
export const selectWishlistLoading = (state: any) => (state.wishlist as WishlistState).loading;
export const selectWishlistError = (state: any) => (state.wishlist as WishlistState).error;


