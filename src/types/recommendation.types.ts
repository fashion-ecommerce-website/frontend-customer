/**
 * Recommendation API Types
 * Updated to match backend DTOs for combined-messages endpoint
 */

export interface CombinedMessageRecommendationRequest {
  message: string;
}

export interface ProductRecommendationResponse {
  objectId: number;
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface NaturalLanguageRecommendationResponse {
  type: string;
  message: string;
  recommendations: ProductRecommendationResponse[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: ProductRecommendationResponse[];
  suggestedQuestions?: string[];
}
