import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { RecentlyViewedItem } from '@/hooks/useRecentlyViewed';

const RECENTLY_ENDPOINTS = {
  GET: '/users/recently',
  CLEAR: '/users/recently/clear',
  DELETE: '/users/recently/delete',
} as const;

class RecentlyViewedApiService {
  /**
   * Fetch recently viewed items
   */
  async getRecentlyViewed(): Promise<ApiResponse<RecentlyViewedItem[]>> {
    return apiClient.get<RecentlyViewedItem[]>(RECENTLY_ENDPOINTS.GET);
  }

  /**
   * Clear all recently viewed items
   */
  async clearAll(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(RECENTLY_ENDPOINTS.CLEAR);
  }

  /**
   * Delete selected recently viewed items
   */
  async deleteItems(slugs: string[]): Promise<ApiResponse<void>> {
    return apiClient.post<void>(RECENTLY_ENDPOINTS.DELETE, { slugs });
  }
}

export const recentlyViewedApiService = new RecentlyViewedApiService();