import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserMeasurements, SizeRecommendationResponse } from '../types';
import { RootState } from '../../../store/rootReducer';

export interface SizeRecommendationState {
  // Measurements
  measurements: UserMeasurements | null;
  measurementsLoading: boolean;
  measurementsError: string | null;
  hasMeasurements: boolean;
  
  // Recommendation
  recommendation: SizeRecommendationResponse | null;
  recommendationLoading: boolean;
  recommendationError: string | null;
  
  // Current product context
  currentProductId: number | null;
  
  // UI state
  showForm: boolean;
}

const initialState: SizeRecommendationState = {
  measurements: null,
  measurementsLoading: false,
  measurementsError: null,
  hasMeasurements: false,
  
  recommendation: null,
  recommendationLoading: false,
  recommendationError: null,
  
  currentProductId: null,
  showForm: false,
};

const sizeRecommendationSlice = createSlice({
  name: 'sizeRecommendation',
  initialState,
  reducers: {
    // ===== FETCH MEASUREMENTS =====
    fetchMeasurementsRequest: (state) => {
      state.measurementsLoading = true;
      state.measurementsError = null;
    },
    fetchMeasurementsSuccess: (state, action: PayloadAction<UserMeasurements>) => {
      state.measurementsLoading = false;
      state.measurements = action.payload;
      state.hasMeasurements = true;
      state.measurementsError = null;
    },
    fetchMeasurementsFailure: (state, action: PayloadAction<string>) => {
      state.measurementsLoading = false;
      state.measurementsError = action.payload;
    },
    
    // ===== SAVE MEASUREMENTS =====
    saveMeasurementsRequest: (state, _action: PayloadAction<Omit<UserMeasurements, 'bmi'>>) => {
      state.measurementsLoading = true;
      state.measurementsError = null;
    },
    saveMeasurementsSuccess: (state, action: PayloadAction<UserMeasurements>) => {
      state.measurementsLoading = false;
      state.measurements = action.payload;
      state.hasMeasurements = true;
      state.measurementsError = null;
      state.showForm = false;
    },
    saveMeasurementsFailure: (state, action: PayloadAction<string>) => {
      state.measurementsLoading = false;
      state.measurementsError = action.payload;
    },
    
    // ===== GET SIZE RECOMMENDATION =====
    getSizeRecommendationRequest: (state, action: PayloadAction<{ productId: number; similarUserLimit?: number }>) => {
      state.recommendationLoading = true;
      state.recommendationError = null;
      state.currentProductId = action.payload.productId;
    },
    getSizeRecommendationSuccess: (state, action: PayloadAction<SizeRecommendationResponse>) => {
      state.recommendationLoading = false;
      state.recommendation = action.payload;
      state.recommendationError = null;
    },
    getSizeRecommendationFailure: (state, action: PayloadAction<string>) => {
      state.recommendationLoading = false;
      state.recommendationError = action.payload;
    },
    
    // ===== SET LOCAL RECOMMENDATION (rule-based fallback) =====
    setLocalRecommendation: (state, action: PayloadAction<SizeRecommendationResponse>) => {
      state.recommendation = action.payload;
      state.recommendationLoading = false;
      state.recommendationError = null;
    },
    
    // ===== UI ACTIONS =====
    showMeasurementsForm: (state) => {
      state.showForm = true;
    },
    hideMeasurementsForm: (state) => {
      state.showForm = false;
    },
    
    // ===== CLEAR STATE =====
    clearRecommendation: (state) => {
      state.recommendation = null;
      state.recommendationError = null;
      state.currentProductId = null;
    },
    clearMeasurements: (state) => {
      state.measurements = null;
      state.hasMeasurements = false;
      state.measurementsError = null;
    },
    resetState: () => initialState,
  },
});

// Export actions
export const {
  fetchMeasurementsRequest,
  fetchMeasurementsSuccess,
  fetchMeasurementsFailure,
  saveMeasurementsRequest,
  saveMeasurementsSuccess,
  saveMeasurementsFailure,
  getSizeRecommendationRequest,
  getSizeRecommendationSuccess,
  getSizeRecommendationFailure,
  setLocalRecommendation,
  showMeasurementsForm,
  hideMeasurementsForm,
  clearRecommendation,
  clearMeasurements,
  resetState,
} = sizeRecommendationSlice.actions;

// Selectors
export const selectMeasurements = (state: RootState) => state.sizeRecommendation.measurements;
export const selectMeasurementsLoading = (state: RootState) => state.sizeRecommendation.measurementsLoading;
export const selectMeasurementsError = (state: RootState) => state.sizeRecommendation.measurementsError;
export const selectHasMeasurements = (state: RootState) => state.sizeRecommendation.hasMeasurements;

export const selectRecommendation = (state: RootState) => state.sizeRecommendation.recommendation;
export const selectRecommendationLoading = (state: RootState) => state.sizeRecommendation.recommendationLoading;
export const selectRecommendationError = (state: RootState) => state.sizeRecommendation.recommendationError;

export const selectShowForm = (state: RootState) => state.sizeRecommendation.showForm;
export const selectCurrentProductId = (state: RootState) => state.sizeRecommendation.currentProductId;

// Export reducer
export const sizeRecommendationReducer = sizeRecommendationSlice.reducer;
export default sizeRecommendationReducer;
