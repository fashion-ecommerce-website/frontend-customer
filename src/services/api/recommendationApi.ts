import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { ChatBotResponse } from '../../types/recommendation.types';

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

// Chatbot response interface
export interface ChatbotResponse {
    message?: string;
    recommendations?: RecommendationProduct[];
    [key: string]: unknown;
}

// Recommendation API endpoints
const RECOMMENDATION_ENDPOINTS = {
    GET_FOR_YOU: '/recommendations/for-you',
    GET_SIMILAR: '/recommendations/similar',
    RECORD_INTERACTION: '/recommendations/interactions',
    CHAT: '/chatbot/chat',
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
     * Send message to chatbot
     * URL: POST /api/chatbot/chat
     * Payload: { message: string }
     * Note: This endpoint does not require authentication
     */
    async chat(message: string): Promise<ApiResponse<ChatBotResponse>> {
        return apiClient.post<ChatBotResponse>(RECOMMENDATION_ENDPOINTS.CHAT, { message }, undefined, true);
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
    chat: (message: string) => recommendationApiService.chat(message),
};
