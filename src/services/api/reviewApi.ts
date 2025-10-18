import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface ReviewItem {
  id: number;
  userId: number;
  username: string;
  avatar?: string; // Optional avatar URL
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

export interface UpdateReviewRequest {
  rating: number;
  content: string;
}

const REVIEW_ENDPOINTS = {
  BASE: '/reviews',
  BY_PRODUCT: (productDetailId: number) => `/reviews/products/${productDetailId}`,
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

  async updateReview(reviewId: number, payload: UpdateReviewRequest): Promise<ApiResponse<ReviewItem>> {
    return apiClient.put<ReviewItem>(`${REVIEW_ENDPOINTS.BASE}/${reviewId}`, payload);
  }

  async deleteReview(reviewId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${REVIEW_ENDPOINTS.BASE}/${reviewId}`);
  }
}

export const reviewApiService = new ReviewApiService();


