import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

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
    return apiClient.put<CartItem>(`/cart/update`, request);
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(cartItemId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/cart/${cartItemId}`);
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/cart');
  }

  /**
   * Remove multiple selected items from cart
   */
  async removeMultipleCartItems(ids: number[]): Promise<ApiResponse<void>> {
    // Backend expects DELETE with body { cartDetailIds: number[] }
    return apiClient.delete<void>('/cart/remove-multiple', { cartDetailIds: ids });
  }
}

// Export singleton instance
export const cartApi = new CartApi();