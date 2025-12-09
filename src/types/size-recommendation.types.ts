// types/size-recommendation.types.ts
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DataQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'LIMITED';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

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
  gender: 'MALE' | 'FEMALE';
  age: number;
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bmi?: number;
  bellyShape?: 'FLAT' | 'NORMAL' | 'ROUND';
  hipShape?: 'NARROW' | 'NORMAL' | 'WIDE';
  chestShape?: 'SLIM' | 'NORMAL' | 'BROAD';
  fitPreference?: 'TIGHT' | 'COMFORTABLE' | 'LOOSE';
  hasReturnHistory?: boolean;
}


