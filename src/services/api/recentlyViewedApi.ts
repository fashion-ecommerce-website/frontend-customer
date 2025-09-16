import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { RecentlyViewedItem } from '@/hooks/useRecentlyViewed';

const RECENTLY_ENDPOINTS = {
  GET: '/users/recently',
  ADD: '/users/recently', // POST with ID in body
  CLEAR: '/users/recently/clear',
  REMOVE: '/users/recently/remove',
} as const;

class RecentlyViewedApiService {
  /**
   * Fetch recently viewed items
   */
  async getRecentlyViewed(): Promise<ApiResponse<RecentlyViewedItem[]>> {
    return apiClient.get<RecentlyViewedItem[]>(RECENTLY_ENDPOINTS.GET);
  }

  /**
   * Add product to recently viewed
   * @param productDetailId - ID of the product detail to add
   */
  async addRecentlyViewed(productDetailId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${RECENTLY_ENDPOINTS.ADD}/${productDetailId}`, {});
  }

  /**
   * Clear all recently viewed items
   */
  async clearAll(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(RECENTLY_ENDPOINTS.CLEAR);
  }

  /**
   * Remove selected recently viewed items by IDs
   */
  async removeItems(productIds: number[]): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(RECENTLY_ENDPOINTS.REMOVE, { productIds });
  }
}

export const recentlyViewedApiService = new RecentlyViewedApiService();