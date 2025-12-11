// types/size-recommendation.types.ts
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DataQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'LIMITED';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

// Type aliases for body shape and preference enums
export type Gender = 'MALE' | 'FEMALE';
export type BellyShape = 'FLAT' | 'NORMAL' | 'ROUND';
export type HipShape = 'NARROW' | 'NORMAL' | 'WIDE';
export type ChestShape = 'SLIM' | 'NORMAL' | 'BROAD';
export type FitPreference = 'TIGHT' | 'COMFORTABLE' | 'LOOSE';

export interface RecommendationMetadata {
  totalSimilarUsers: number;
  totalPurchases: number;
  averageRating: number;
  highRatingRatio: number;
  confidenceLevel: ConfidenceLevel;
  dataQuality: DataQuality;
  hasCloseAlternative: boolean;
}

export interface AlternativeSize {
  size: string;
  confidence: number;
}

export interface SizeRecommendationResponse {
  recommendedSize: string | null;
  confidence: number | null;
  alternatives: AlternativeSize[];
  metadata: RecommendationMetadata | null;
  hasMeasurements: boolean;
}

// Keep existing types
export interface UserMeasurements {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bmi?: number;
  bellyShape?: BellyShape;
  hipShape?: HipShape;
  chestShape?: ChestShape;
  fitPreference?: FitPreference;
  hasReturnHistory?: boolean;
  braSize?: string;
  lastUpdated?: string;
}


