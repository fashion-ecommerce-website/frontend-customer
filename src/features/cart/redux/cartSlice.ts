import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ApiStatus } from '@/types/api.types';
import { 
  CartItem, 
  CartState, 
  CartSummary, 
  UpdateCartItemPayload,
  AddToCartPayload 
} from '@/types/cart.types';

// Calculate cart summary
const calculateCartSummary = (items: CartItem[]): CartSummary => {
  // Only calculate for selected items
  const selectedItems = items.filter(item => item.selected !== false); // Default to selected if not specified
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = selectedItems.reduce((count, item) => count + item.quantity, 0);
  
  return {
    subtotal,
    total: subtotal, // Total is same as subtotal without shipping
    itemCount
  };
};

// Initial state
const initialState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    total: 0,
    itemCount: 0
  },
  status: ApiStatus.SUCCESS,
  error: null,
  loading: false
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.error = null;
    },

    // Set cart items
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      // Set all items as selected by default when loading from API
      state.items = action.payload.map(item => ({ ...item, selected: true }));
      state.summary = calculateCartSummary(state.items);
      state.loading = false;
      state.error = null;
      state.status = ApiStatus.SUCCESS;
    },

    // Add item to cart
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
        existingItem.updatedAt = action.payload.updatedAt;
        // Keep existing selected state
      } else {
        // New items are selected by default
        state.items.push({ ...action.payload, selected: true });
      }
      state.summary = calculateCartSummary(state.items);
      state.loading = false;
      state.error = null;
    },

    // Update cart item quantity
    updateCartItem: (state, action: PayloadAction<{ cartItemId: number; updatedItem: CartItem }>) => {
      const { cartItemId, updatedItem } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === cartItemId);
      if (itemIndex !== -1) {
        state.items[itemIndex] = updatedItem;
        state.summary = calculateCartSummary(state.items);
      }
      state.loading = false;
      state.error = null;
    },

    // Remove item from cart
    removeCartItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.summary = calculateCartSummary(state.items);
      state.loading = false;
      state.error = null;
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.summary = calculateCartSummary([]);
      state.loading = false;
      state.error = null;
    },

    // Select/unselect cart item
    selectCartItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.selected = true;
        state.summary = calculateCartSummary(state.items);
      }
    },

    unselectCartItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.selected = false;
        state.summary = calculateCartSummary(state.items);
      }
    },

    // Select/unselect all cart items
    selectAllCartItems: (state) => {
      state.items.forEach(item => {
        item.selected = true;
      });
      state.summary = calculateCartSummary(state.items);
    },

    unselectAllCartItems: (state) => {
      state.items.forEach(item => {
        item.selected = false;
      });
      state.summary = calculateCartSummary(state.items);
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.status = ApiStatus.ERROR;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
      state.status = ApiStatus.SUCCESS;
    }
  }
});

// Export actions
export const {
  setLoading,
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  selectCartItem,
  unselectCartItem,
  selectAllCartItems,
  unselectAllCartItems,
  setError,
  clearError
} = cartSlice.actions;

// Export selectors
export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartSummary = (state: RootState) => state.cart.summary;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartItemCount = (state: RootState) => state.cart.summary.itemCount;

// Optimized selectors using createSelector for better performance
export const selectSelectedCartItems = createSelector(
  [selectCartItems],
  (items) => items.filter(item => item.selected !== false)
);

export const selectAllItemsSelected = createSelector(
  [selectCartItems],
  (items) => items.length > 0 && items.every(item => item.selected !== false)
);

export const selectCartTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(
  [selectSelectedCartItems],
  (selectedItems) => selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

export const selectHasSelectedItems = createSelector(
  [selectSelectedCartItems],
  (selectedItems) => selectedItems.length > 0
);

// Export reducer
export const cartReducer = cartSlice.reducer;