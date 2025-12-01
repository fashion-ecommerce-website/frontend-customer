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

export enum RecommendationType {
  PRODUCT = 'PRODUCT',
  GENERAL = 'GENERAL',
  ERROR = 'ERROR'
}

export interface ChatBotResponse {
  type: RecommendationType;
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
