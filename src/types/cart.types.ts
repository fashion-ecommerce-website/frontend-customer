/**
 * Cart related types and interfaces
 */

import { ApiStatus } from './api.types';

// Cart item interface - matches API response with promotion
export interface CartItem {
  id: number;
  productDetailId: number;
  productTitle: string;
  productSlug: string;
  colorName: string;
  sizeName: string;
  price: number;          // base price
  finalPrice?: number;     // after promotion
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
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
  // The cart detail id (cart item id)
  cartDetailId: number;
  // Optional new productDetailId if variant/size changed
  newProductDetailId?: number;
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