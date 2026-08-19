import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Cart item interface - matches API response with promotion
export interface CartItem {
  id: number;
  productDetailId: number;
  productTitle: string;
  productSlug: string;
  colorName: string;
  sizeName: string;
  price: number;          // base price
  finalPrice?: number;    // after promotion (optional for backward compatibility)
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
  quantity: number;
  availableQuantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Update cart item request
export interface UpdateCartItemRequest {
  // The id of the cart detail being updated (cart item id)
  cartDetailId: number;
  // If changing variant/size, indicate the new productDetailId
  newProductDetailId?: number;
  // The desired quantity
  quantity: number;
}

// Add to cart request
export interface AddToCartRequest {
  productDetailId: number;
  quantity: number;
}

// Cart API class
class CartApi {
  /**
   * Get user's cart items
   */
  async getCartItems(): Promise<ApiResponse<CartItem[]>> {
    return apiClient.get<CartItem[]>('/cart');
  }

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<ApiResponse<CartItem>> {
    try {
      const response = await apiClient.post<CartItem>('/cart', request);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(request: UpdateCartItemRequest): Promise<ApiResponse<CartItem>> {
    return apiClient.put<CartItem>(`/cart`, request);
  }

  /**
   * Remove items from cart (single or multiple)
   */
  async removeFromCart(cartDetailIds: number[]): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/cart', { cartDetailIds });
  }

  /**
   * Remove single item from cart
   */
  async removeCartItem(cartItemId: number): Promise<ApiResponse<void>> {
    return this.removeFromCart([cartItemId]);
  }

  /**
   * Remove multiple selected items from cart
   */
  async removeMultipleCartItems(ids: number[]): Promise<ApiResponse<void>> {
    return this.removeFromCart(ids);
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/cart/clear');
  }
}

// Export singleton instance
export const cartApi = new CartApi();