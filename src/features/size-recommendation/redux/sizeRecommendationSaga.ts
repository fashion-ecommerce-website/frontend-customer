import { PayloadAction } from '@reduxjs/toolkit';
import type { UserMeasurements, SizeRecommendationResponse, Size } from '../types';
import { recommendationApi } from '../../../services/api/recommendationApi';
import { 
  calculateRecommendedSize, 
  getSmallerSize, 
  getLargerSize 
} from '../utils/sizeCalculation';
import {
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
} from './sizeRecommendationSlice';
import { 
  saveMeasurements as saveToLocalStorage,
  getMeasurements as getFromLocalStorage,
  calculateBMI
} from '@/utils/localStorage/measurements';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest, select } = effects;

// ===== FETCH MEASUREMENTS SAGA =====
function* handleFetchMeasurements(): Generator {
  try {
    // First try to get from API (if user is logged in)
    const response = yield call([recommendationApi, 'getMeasurements']);
    
    if (response.success && response.data) {
      yield put(fetchMeasurementsSuccess(response.data as UserMeasurements));
      // Also save to localStorage for offline access
      saveToLocalStorage(response.data as UserMeasurements);
    } else {
      // Fallback to localStorage
      const localMeasurements = getFromLocalStorage();
      if (localMeasurements) {
        yield put(fetchMeasurementsSuccess(localMeasurements));
      } else {
        yield put(fetchMeasurementsFailure('No measurements found'));
      }
    }
  } catch (error) {
    // Fallback to localStorage on API error
    const localMeasurements = getFromLocalStorage();
    if (localMeasurements) {
      yield put(fetchMeasurementsSuccess(localMeasurements));
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch measurements';
      yield put(fetchMeasurementsFailure(errorMessage));
    }
  }
}

// ===== SAVE MEASUREMENTS SAGA =====
function* handleSaveMeasurements(
  action: PayloadAction<Omit<UserMeasurements, 'bmi'>>
): Generator {
  try {
    const measurementsWithBmi: UserMeasurements = {
      ...action.payload,
      bmi: calculateBMI(action.payload.height, action.payload.weight),
      lastUpdated: new Date().toISOString(),
    };
    
    // Save to localStorage first (always works)
    saveToLocalStorage(measurementsWithBmi);
    
    // Try to save to API (if user is logged in)
    try {
      const response = yield call([recommendationApi, 'saveMeasurements'], action.payload);
      if (response.success && response.data) {
        yield put(saveMeasurementsSuccess(response.data as UserMeasurements));
        return;
      }
    } catch {
      // API save failed, but localStorage succeeded - still success
      console.warn('Failed to save measurements to API, using localStorage');
    }
    
    yield put(saveMeasurementsSuccess(measurementsWithBmi));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save measurements';
    yield put(saveMeasurementsFailure(errorMessage));
  }
}

// ===== GET SIZE RECOMMENDATION SAGA =====
function* handleGetSizeRecommendation(
  action: PayloadAction<{ productId: number; similarUserLimit?: number; category?: string; availableSizes?: Size[] }>
): Generator {
  try {
    const { productId, similarUserLimit = 30, category = 'tops', availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] } = action.payload;
    
    // Get current measurements from state
    const measurements: UserMeasurements | null = yield select(
      (state: { sizeRecommendation: { measurements: UserMeasurements | null } }) => 
        state.sizeRecommendation.measurements
    );
    
    if (!measurements) {
      yield put(getSizeRecommendationFailure('Please add your measurements first'));
      return;
    }
    
    // Try to get recommendation from API
    try {
      const response = yield call([recommendationApi, 'getSizeRecommendation'], productId, similarUserLimit);
      
      if (response.success && response.data) {
        const apiRecommendation = response.data as SizeRecommendationResponse;
        
        // If API returns valid recommendation, use it
        if (apiRecommendation.recommendedSize) {
          yield put(getSizeRecommendationSuccess(apiRecommendation));
          return;
        }
        
        // API returned no data - fallback to rule-based
        console.info('API returned no recommendation data, using rule-based fallback');
      }
    } catch (apiError) {
      console.warn('API recommendation failed, using rule-based fallback:', apiError);
    }
    
    // Fallback: Calculate locally using rule-based logic
    const recommendedSize = calculateRecommendedSize(measurements, category);
    
    const altSizes: { size: string; confidence: number }[] = [];
    const smaller = getSmallerSize(recommendedSize);
    const larger = getLargerSize(recommendedSize);
    
    if (smaller && availableSizes.includes(smaller)) {
      altSizes.push({ size: smaller, confidence: 0.15 });
    }
    if (larger && availableSizes.includes(larger)) {
      altSizes.push({ size: larger, confidence: 0.10 });
    }
    
    const localRecommendation: SizeRecommendationResponse = {
      recommendedSize,
      confidence: 0.65, // Lower confidence for rule-based
      alternatives: altSizes,
      metadata: {
        totalSimilarUsers: 0,
        totalPurchases: 0,
        averageRating: 0,
        highRatingRatio: 0,
        confidenceLevel: 'MEDIUM',
        dataQuality: 'LIMITED',
        hasCloseAlternative: altSizes.length > 0,
      },
      hasMeasurements: true,
    };
    
    yield put(setLocalRecommendation(localRecommendation));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get size recommendation';
    yield put(getSizeRecommendationFailure(errorMessage));
  }
}

// ===== ROOT SAGA =====
export function* sizeRecommendationSaga(): Generator {
  yield takeLatest(fetchMeasurementsRequest.type, handleFetchMeasurements);
  yield takeLatest(saveMeasurementsRequest.type, handleSaveMeasurements);
  yield takeLatest(getSizeRecommendationRequest.type, handleGetSizeRecommendation);
}

export default sizeRecommendationSaga;
