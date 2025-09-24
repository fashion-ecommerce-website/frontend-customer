import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetail } from '@/services/api/productApi';
import { ProductDetailState } from '../types';

// Initial state
const initialState: ProductDetailState = {
  product: null,
  isLoading: true, // Start with loading state
  error: null,
  selectedColor: null,
  selectedSize: null,
  isColorLoading: false, // Separate loading for color changes
};

// Product Detail slice
const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  reducers: {
    // Fetch product by ID actions
    fetchProductRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action: PayloadAction<ProductDetail>) => {
      console.log('Redux: fetchProductSuccess', action.payload.title);
      state.isLoading = false;
      state.product = action.payload;
      state.error = null;
      // Set default color selection
      if (action.payload.colors.length > 0) {
        state.selectedColor = action.payload.activeColor || action.payload.colors[0];
      }
      state.selectedSize = null;
    },
    fetchProductFailure: (state, action: PayloadAction<string>) => {
      console.log('Redux: fetchProductFailure', action.payload);
      state.isLoading = false;
      state.error = action.payload;
      state.product = null;
    },

    // Fetch product by color actions
    fetchProductByColorRequest: (state, action: PayloadAction<{ id: string; color: string; size?: string }>) => {
      state.isColorLoading = true; // Use separate loading state
      state.error = null;
    },
    fetchProductByColorSuccess: (state, action: PayloadAction<ProductDetail>) => {
      state.isColorLoading = false; // Use separate loading state
      state.product = action.payload;
      state.error = null;
      state.selectedColor = action.payload.activeColor;
      // Do NOT override user's size selection with API's activeSize on color change
      // Keep whatever user had selected; if none, remain null
      state.selectedSize = state.selectedSize ? state.selectedSize : null;
    },
    fetchProductByColorFailure: (state, action: PayloadAction<string>) => {
      state.isColorLoading = false; // Use separate loading state
      state.error = action.payload;
      // Keep current product data if color change fails
    },

    // Selection actions
    setSelectedColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
    setSelectedSize: (state, action: PayloadAction<string>) => {
      state.selectedSize = action.payload;
    },

    // Reset action
    resetProductDetail: () => ({
      ...initialState,
      isLoading: true, // Reset to loading state
      isColorLoading: false,
    }),
  },
});

export const {
  fetchProductRequest,
  fetchProductSuccess,
  fetchProductFailure,
  fetchProductByColorRequest,
  fetchProductByColorSuccess,
  fetchProductByColorFailure,
  setSelectedColor,
  setSelectedSize,
  resetProductDetail,
} = productDetailSlice.actions;

export default productDetailSlice.reducer;