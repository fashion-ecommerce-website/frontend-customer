/**
 * Size Recommendation Types
 */

export type Gender = 'MALE' | 'FEMALE';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type BellyShape = 'FLAT' | 'NORMAL' | 'ROUND';
export type HipShape = 'NARROW' | 'NORMAL' | 'WIDE';
export type ChestShape = 'SLIM' | 'NORMAL' | 'BROAD';
export type FitPreference = 'TIGHT' | 'COMFORTABLE' | 'LOOSE';

/**
 * User body measurements (stored in localStorage)
 */
export interface UserMeasurements {
  // Basic info
  gender: Gender;
  age: number;
  
  // Body measurements (cm and kg)
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  
  // Calculated
  bmi: number;
  
  // Body shapes
  bellyShape: BellyShape;
  hipShape: HipShape;
  
  // Preferences
  fitPreference: FitPreference;
  hasReturnHistory: boolean;
  
  // Female-specific (optional)
  braSize?: string;
  
  // Male-specific (optional)
  chestShape?: ChestShape;
  
  // Metadata
  lastUpdated: string;
}

/**
 * Size recommendation request
 */
export interface SizeRecommendationRequest {
  userId?: number;
  productId: number;
  measurements: UserMeasurements;
}

/**
 * Size recommendation response from backend
 */
export interface SizeRecommendationResponse {
  recommendedSize: Size;
  confidence: number; // 0-1
  alternativeSizes: Array<{
    size: Size;
    confidence: number;
  }>;
  reasoning: string;
}

/**
 * Size chart for product
 */
export interface ProductSizeChart {
  size: Size;
  chest: { min: number; max: number };
  waist: { min: number; max: number };
  hips: { min: number; max: number };
  height: { min: number; max: number };
}
