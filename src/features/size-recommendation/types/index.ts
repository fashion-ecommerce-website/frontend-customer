// types/index.ts
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DataQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'LIMITED';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

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

export interface UserMeasurements {
  gender: Gender;
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
  lastUpdated?: string;
}

export interface SizeRecommendationPresenterProps {
  measurements: UserMeasurements | null;
  recommendation: SizeRecommendationResponse | null;
  category: string;
  availableSizes: Size[];
  loading: boolean;
  error: string | null;
  showForm: boolean;
  onShowForm: () => void;
  onHideForm: () => void;
  onSaveMeasurements: (measurements: UserMeasurements) => void;
  onGetRecommendation: () => void;
  onSizeSelect?: (size: Size) => void;
}

export interface MeasurementsFormProps {
  onSave: (measurements: UserMeasurements) => void;
  onCancel: () => void;
  initialData?: UserMeasurements | null;
}

export interface MeasurementsWizardProps {
  onSave: (measurements: UserMeasurements) => void;
  onCancel?: () => void;
  initialData?: UserMeasurements | null;
  productImage?: string;
}
