import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { Review, ReviewFormData } from '../../features/profile/types/profile.types';
import { productApiService } from './productApi';

export interface ReviewItem {
  id: number;
  userId: number;
  username: string;
  avatar?: string; // Optional avatar URL
  productDetailId: number;
  productName?: string;
  productImage?: string;
  productColor?: string;
  productSize?: string;
  rating: number;
  content: string;
  createdAt: string;
}

// Backend ReviewResponse format
export interface BackendReviewResponse {
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

export interface UpdateReviewRequest {
  rating: number;
  content: string;
}

// Extended Review interface for profile reviews
export interface ProfileReviewItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage?: string;
  productColor?: string;
  productSize?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

const REVIEW_ENDPOINTS = {
  BASE: '/reviews',
  BY_PRODUCT: (productDetailId: number) => `/reviews/products/${productDetailId}`,
} as const;

// Helper function to fetch product details
const fetchProductDetails = async (productDetailId: number): Promise<{
  name: string;
  color?: string;
  size?: string;
  image?: string;
}> => {
  try {
    const response = await productApiService.getProductById(productDetailId.toString());
    if (response.success && response.data) {
      // Get the first available size if activeSize is not set
      const size = response.data.activeSize || 
        (response.data.mapSizeToQuantity && Object.keys(response.data.mapSizeToQuantity).length > 0 
          ? Object.keys(response.data.mapSizeToQuantity)[0] 
          : undefined);
      
      return {
        name: response.data.title,
        color: response.data.activeColor,
        size: size,
        image: response.data.images?.[0], // First image
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch product details for ID ${productDetailId}:`, error);
  }
  return {
    name: `Product ${productDetailId}`,
  };
};

// Helper function to map backend response to frontend format
const mapBackendToProfileReview = (backendReview: BackendReviewResponse, productDetails?: {
  name: string;
  color?: string;
  size?: string;
  image?: string;
}): ProfileReviewItem => {
  return {
    id: backendReview.id.toString(),
    userId: backendReview.userId.toString(),
    productId: backendReview.productDetailId.toString(),
    productName: productDetails?.name || `Product ${backendReview.productDetailId}`,
    productImage: productDetails?.image,
    productColor: productDetails?.color,
    productSize: productDetails?.size,
    rating: backendReview.rating,
    comment: backendReview.content,
    createdAt: backendReview.createdAt,
    updatedAt: backendReview.createdAt,
    isVerified: true, 
  };
};

class ReviewApiService {
  async getReviewsByProduct(productDetailId: number): Promise<ApiResponse<ReviewItem[]>> {
    const response = await apiClient.get<ReviewItem[]>(REVIEW_ENDPOINTS.BY_PRODUCT(productDetailId), undefined, true);
    
    if (response.success && response.data) {
      // Fetch product details for each review individually
      const reviewsWithProductDetails = await Promise.all(
        response.data.map(async (review) => {
          const productDetails = await fetchProductDetails(review.productDetailId);
          return {
            ...review,
            productName: productDetails.name,
            productImage: productDetails.image,
            productColor: productDetails.color,
            productSize: productDetails.size,
          };
        })
      );
      
      return {
        ...response,
        data: reviewsWithProductDetails,
      };
    }
    
    return response;
  }

  async createReview(payload: CreateReviewRequest): Promise<ApiResponse<ReviewItem>> {
    return apiClient.post<ReviewItem>(REVIEW_ENDPOINTS.BASE, payload);
  }

  async getMyReviews(): Promise<ApiResponse<ReviewItem[]>> {
    return apiClient.get<ReviewItem[]>(REVIEW_ENDPOINTS.BASE);
  }

  async getMyProfileReviews(page: number = 1, limit: number = 5): Promise<ApiResponse<{
    reviews: ProfileReviewItem[];
    totalReviews: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }>> {
    // Backend doesn't support pagination yet, so we get all reviews
    const response = await apiClient.get<BackendReviewResponse[]>(REVIEW_ENDPOINTS.BASE);
    console.log('API Response:', response); // Debug log
    
    if (response.success && response.data) {
      console.log('Raw backend data:', response.data); // Debug log
      
      // Map reviews and fetch product details
      const mappedData = await Promise.all(
        response.data.map(async (backendReview) => {
          const productDetails = await fetchProductDetails(backendReview.productDetailId);
          return mapBackendToProfileReview(backendReview, productDetails);
        })
      );
      
      console.log('Mapped data with product names:', mappedData); // Debug log
      
      // Client-side pagination since backend doesn't support it yet
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedReviews = mappedData.slice(startIndex, endIndex);
      
      const totalPages = Math.ceil(mappedData.length / limit) || 1;
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;
      
      console.log('Final paginated reviews:', paginatedReviews); // Debug log
      
      return {
        ...response,
        data: {
          reviews: paginatedReviews,
          totalReviews: mappedData.length,
          totalPages,
          hasNext,
          hasPrevious,
        },
      };
    }
    return {
      success: false,
      message: response.message || 'Failed to fetch reviews',
      status: response.status,
      data: {
        reviews: [],
        totalReviews: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    };
  }

  async updateReview(reviewId: number, payload: UpdateReviewRequest): Promise<ApiResponse<ReviewItem>> {
    return apiClient.put<ReviewItem>(`${REVIEW_ENDPOINTS.BASE}/${reviewId}`, payload);
  }

  async updateProfileReview(reviewId: string, payload: ReviewFormData): Promise<ApiResponse<ProfileReviewItem>> {
    // Convert string ID to number for backend
    const numericId = parseInt(reviewId, 10);
    // Map ReviewFormData to UpdateReviewRequest format
    const backendPayload = {
      rating: payload.rating,
      content: payload.comment
    };
    const response = await apiClient.put<BackendReviewResponse>(`${REVIEW_ENDPOINTS.BASE}/${numericId}`, backendPayload);
    
    if (response.success && response.data) {
      // Map backend response to ProfileReviewItem format and fetch product details
      const productDetails = await fetchProductDetails(response.data.productDetailId);
      const mappedData = mapBackendToProfileReview(response.data, productDetails);
      return {
        ...response,
        data: mappedData,
      };
    }
    
    return {
      success: false,
      message: response.message || 'Failed to update review',
      status: response.status,
      data: {} as ProfileReviewItem,
    };
  }

  async deleteReview(reviewId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${REVIEW_ENDPOINTS.BASE}/${reviewId}`);
  }

  async deleteProfileReview(reviewId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${REVIEW_ENDPOINTS.BASE}/${reviewId}`);
  }
}

export const reviewApiService = new ReviewApiService();


