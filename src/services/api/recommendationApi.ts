import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import type {
    UserMeasurements,
    SizeRecommendationResponse
} from '../../types/size-recommendation.types';

// Action Type Enum - matches backend enum
export enum ActionType {
    VIEW = 'VIEW',
    LIKE = 'LIKE',
    ADD_TO_CART = 'ADD_TO_CART',
    PURCHASE = 'PURCHASE',
}

// Recommendation product interface - matches API response
export interface RecommendationProduct {
    productId: number;
    detailId: number;
    productTitle: string;
    productSlug: string;
    colorName: string;
    price: number;
    finalPrice: number;
    percentOff: number;
    promotionId: number | null;
    promotionName: string | null;
    quantity: number;
    colors: string[];
    imageUrls: string[];
    categorySlug: string;
}

// Recommendation API endpoints
const RECOMMENDATION_ENDPOINTS = {
    GET_FOR_YOU: '/recommendations/for-you',
    GET_SIMILAR: '/recommendations/similar',
    RECORD_INTERACTION: '/recommendations/interactions',
    SIZE_RECOMMENDATION: '/recommendations/size-recommendation',
    CHAT: '/chatbot/chat',
} as const;

// User Measurements API endpoints
const MEASUREMENTS_ENDPOINTS = {
    MEASUREMENTS: '/users/measurements',
    EXISTS: '/users/measurements/exists',
} as const;

// Recommendation API service
export class RecommendationApiService {
    /**
     * Get personalized recommendations for the current user
     * URL: /api/recommendations/for-you?limit={limit}
     */
    async getRecommendationsForYou(limit: number = 10): Promise<ApiResponse<RecommendationProduct[]>> {
        const url = `${RECOMMENDATION_ENDPOINTS.GET_FOR_YOU}?limit=${limit}`;
        return apiClient.get<RecommendationProduct[]>(url);
    }

    /**
     * Get similar products based on an item
     * URL: /api/recommendations/similar/{itemId}?limit={limit}
     */
    async getSimilarItems(itemId: number, limit: number = 10): Promise<ApiResponse<RecommendationProduct[]>> {
        const url = `${RECOMMENDATION_ENDPOINTS.GET_SIMILAR}/${itemId}?limit=${limit}`;
        return apiClient.get<RecommendationProduct[]>(url);
    }

    /**
     * Record user interaction with a product
     * URL: /api/recommendations/interactions
     * Requires authentication
     */
    async recordInteraction(
        productId: number,
        actionType: ActionType,
        count: number = 1
    ): Promise<ApiResponse<void>> {
        return apiClient.post<void>(RECOMMENDATION_ENDPOINTS.RECORD_INTERACTION, {
            productId,
            actionType,
            count,
        });
    }

    /**
     * Get size recommendation based on user measurements
     * URL: /api/recommendations/size-recommendation/{productId}?similarUserLimit={limit}
     * Requires authentication and user measurements
     */
    async getSizeRecommendation(
        productId: number,
        similarUserLimit: number = 30
    ): Promise<ApiResponse<SizeRecommendationResponse>> {
        const url = `${RECOMMENDATION_ENDPOINTS.SIZE_RECOMMENDATION}/${productId}?similarUserLimit=${similarUserLimit}`;
        return apiClient.get<SizeRecommendationResponse>(url);
    }

    /**
     * Save or update user measurements
     * URL: /api/users/measurements
     * Requires authentication
     */
    async saveMeasurements(measurements: Omit<UserMeasurements, 'bmi'>): Promise<ApiResponse<UserMeasurements>> {
        return apiClient.post<UserMeasurements>(MEASUREMENTS_ENDPOINTS.MEASUREMENTS, measurements);
    }

    /**
     * Get current user's measurements
     * URL: /api/users/measurements
     * Requires authentication
     */
    async getMeasurements(): Promise<ApiResponse<UserMeasurements>> {
        return apiClient.get<UserMeasurements>(MEASUREMENTS_ENDPOINTS.MEASUREMENTS);
    }

    /**
     * Check if current user has measurements saved
     * URL: /api/users/measurements/exists
     * Requires authentication
     */
    async hasMeasurements(): Promise<ApiResponse<boolean>> {
        return apiClient.get<boolean>(MEASUREMENTS_ENDPOINTS.EXISTS);
    }

    /**
     * Delete current user's measurements
     * URL: /api/users/measurements
     * Requires authentication
     */
    async deleteMeasurements(): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(MEASUREMENTS_ENDPOINTS.MEASUREMENTS);
    }

    /**
     * Get recommendations based on natural language chat message
     * URL: /api/chatbot/chat
     */
    async getCombinedMessageRecommendations(data: { message: string }): Promise<ApiResponse<any>> {
        return apiClient.post<any>(RECOMMENDATION_ENDPOINTS.CHAT, data);
    }
}

// Export singleton instance
export const recommendationApiService = new RecommendationApiService();

// Export API functions
export const recommendationApi = {
    getRecommendationsForYou: (limit?: number) => recommendationApiService.getRecommendationsForYou(limit),
    getSimilarItems: (itemId: number, limit?: number) => recommendationApiService.getSimilarItems(itemId, limit),
    recordInteraction: (productId: number, actionType: ActionType, count?: number) =>
        recommendationApiService.recordInteraction(productId, actionType, count),
    getSizeRecommendation: (productId: number, similarUserLimit?: number) =>
        recommendationApiService.getSizeRecommendation(productId, similarUserLimit),
    saveMeasurements: (measurements: Omit<UserMeasurements, 'bmi'>) =>
        recommendationApiService.saveMeasurements(measurements),
    getMeasurements: () => recommendationApiService.getMeasurements(),
    hasMeasurements: () => recommendationApiService.hasMeasurements(),
    deleteMeasurements: () => recommendationApiService.deleteMeasurements(),
    getCombinedMessageRecommendations: (data: { message: string }) => recommendationApiService.getCombinedMessageRecommendations(data),
};
