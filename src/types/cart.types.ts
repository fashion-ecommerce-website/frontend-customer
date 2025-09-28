/**
 * Cart related types and interfaces
 */

import { ApiStatus } from './api.types';

// Cart item interface - matches API response
export interface CartItem {
  id: number;
  productDetailId: number;
  productTitle: string;
  productSlug: string;
  colorName: string;
  sizeName: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  selected?: boolean; // Client-side only field for selection state
}

// Cart summary calculation
export interface CartSummary {
  subtotal: number;
  total: number;
  itemCount: number;
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  status: ApiStatus;
  error: string | null;
  loading: boolean;
}

// Cart actions payload types
export interface UpdateCartItemPayload {
  cartItemId: number;
  quantity: number;
}

export interface AddToCartPayload {
  productDetailId: number;
  quantity: number;
}

// Cart checkout data
export interface CheckoutData {
  items: CartItem[];
  summary: CartSummary;
  shippingAddress?: {
    id: number;
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
}