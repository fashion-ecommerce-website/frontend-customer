/**
 * Recommendation API Types
 */

export interface RecommendationRequest {
  userId: string;
  message: string;
  location?: string;
  limit?: number;
}

export interface RecommendationProduct {
  detailId: number;
  productTitle: string;
  productSlug: string;
  colorName: string;
  price: number;
  quantity: number;
  colors: string[];
  imageUrls: string[];
  matchScore: number;
  matchingAttributes: string[];
}

export interface RecommendationResponse {
  status: 'SUCCESS' | 'NEEDS_MORE_INFO' | 'ERROR';
  recommendations: RecommendationProduct[];
  message: string;
  suggestedQuestions: string[];
  confidenceScore: number;
  interpretationSummary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: RecommendationProduct[];
  suggestedQuestions?: string[];
}
