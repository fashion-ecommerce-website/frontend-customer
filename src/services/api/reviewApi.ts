import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface ReviewItem {
  id: number;
  userId: number;
  username: string;
  productDetailId: number;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productDetailId: number;
  rating: number;
  content: string;
}

const REVIEW_ENDPOINTS = {
  BASE: '/reviews',
  BY_PRODUCT: (productDetailId: number) => `/reviews/product/${productDetailId}`,
} as const;

class ReviewApiService {
  async getReviewsByProduct(productDetailId: number): Promise<ApiResponse<ReviewItem[]>> {
    return apiClient.get<ReviewItem[]>(REVIEW_ENDPOINTS.BY_PRODUCT(productDetailId), undefined, true);
  }

  async createReview(payload: CreateReviewRequest): Promise<ApiResponse<ReviewItem>> {
    return apiClient.post<ReviewItem>(REVIEW_ENDPOINTS.BASE, payload);
  }

  async getMyReviews(): Promise<ApiResponse<ReviewItem[]>> {
    return apiClient.get<ReviewItem[]>(REVIEW_ENDPOINTS.BASE);
  }
}

export const reviewApiService = new ReviewApiService();


