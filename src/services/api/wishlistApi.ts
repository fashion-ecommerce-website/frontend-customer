import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface WishlistItem {
  productTitle: string;
  colorName?: string | null;
  productSlug?: string;
  imageUrls: string[];
  colors: string[];
  price: number;          // base price
  finalPrice?: number;     // after promotion
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
  quantity?: number;
  detailId: number;
}

interface BackendWishlistItem {
  title?: string;
  productTitle?: string;
  activeColor?: string;
  colorName?: string;
  productSlug?: string;
  images?: string[];
  colors?: string[];
  price: number;
  finalPrice?: number;
  percentOff?: number;
  promotionId?: number;
  promotionName?: string;
  quantity?: number;
  detailId: number;
}

const WISHLIST_ENDPOINTS = {
  GET_ALL: '/wishlists',
  TOGGLE: '/wishlists/toggle', // POST /wishlists/toggle/{id}
  CLEAR: '/wishlists/clear',
} as const;

class WishlistApiService {
  /** Fetch wishlist items */
  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    const res = await apiClient.get<BackendWishlistItem[]>(WISHLIST_ENDPOINTS.GET_ALL);
    if (!res.success || !Array.isArray(res.data)) {
      return { success: false, data: null, message: res.message } as ApiResponse<WishlistItem[]>;
    }
    // Map backend shape -> frontend WishlistItem
    const mapped: WishlistItem[] = res.data.map((it) => ({
      productTitle: it.title ?? it.productTitle ?? '',
      colorName: it.activeColor ?? it.colorName ?? null,
      productSlug: it.productSlug ?? '',
      imageUrls: Array.isArray(it.images) ? it.images : [],
      colors: Array.isArray(it.colors) ? it.colors.filter(Boolean) : [],
      price: Number(it.price) || 0,
      finalPrice: it.finalPrice ? Number(it.finalPrice) : undefined,
      percentOff: it.percentOff ? Number(it.percentOff) : undefined,
      promotionId: it.promotionId ? Number(it.promotionId) : undefined,
      promotionName: it.promotionName || undefined,
      quantity: Number(it.quantity) || undefined,
      detailId: Number(it.detailId),
    }));
    return { success: true, data: mapped } as ApiResponse<WishlistItem[]>;
  }

  /** Toggle wishlist for a product detail id (add if absent, remove if present) */
  async toggle(detailId: number): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${WISHLIST_ENDPOINTS.TOGGLE}/${detailId}`, {});
  }

  /** Clear entire wishlist using backend endpoint */
  async clearAll(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(WISHLIST_ENDPOINTS.CLEAR);
  }

  /** Remove selected wishlist items by product detail IDs via toggle */
  async removeItems(detailIds: number[]): Promise<ApiResponse<void>> {
    for (const id of detailIds) {
      await this.toggle(id);
    }
    return { success: true } as ApiResponse<void>;
  }
}

export const wishlistApiService = new WishlistApiService();


