'use client';

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { UserMeasurements, Size } from '../types';
import { SizeRecommendationPresenter } from '../components/SizeRecommendationPresenter';
import {
  fetchMeasurementsRequest,
  saveMeasurementsRequest,
  getSizeRecommendationRequest,
  showMeasurementsForm,
  hideMeasurementsForm,
  selectMeasurements,
  selectMeasurementsLoading,
  selectRecommendation,
  selectRecommendationLoading,
  selectRecommendationError,
  selectShowForm,
} from '../redux';

interface SizeRecommendationContainerProps {
  productId: number;
  category: string;
  availableSizes: Size[];
  onSizeSelect?: (size: Size) => void;
}

export const SizeRecommendationContainer: React.FC<SizeRecommendationContainerProps> = ({ 
  productId,
  category, 
  availableSizes,
  onSizeSelect 
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const measurements = useSelector(selectMeasurements);
  const measurementsLoading = useSelector(selectMeasurementsLoading);
  const recommendation = useSelector(selectRecommendation);
  const recommendationLoading = useSelector(selectRecommendationLoading);
  const recommendationError = useSelector(selectRecommendationError);
  const showForm = useSelector(selectShowForm);

  // Load measurements on mount
  useEffect(() => {
    dispatch(fetchMeasurementsRequest());
  }, [dispatch]);

  // Handlers
  const handleSaveMeasurements = useCallback((newMeasurements: UserMeasurements) => {
    dispatch(saveMeasurementsRequest(newMeasurements));
    // After saving, get recommendation
    setTimeout(() => {
      dispatch(getSizeRecommendationRequest({ 
        productId, 
        category, 
        availableSizes 
      } as { productId: number; similarUserLimit?: number; category?: string; availableSizes?: Size[] }));
    }, 100);
  }, [dispatch, productId, category, availableSizes]);

  const handleGetRecommendation = useCallback(() => {
    if (measurements) {
      dispatch(getSizeRecommendationRequest({ 
        productId, 
        category, 
        availableSizes 
      } as { productId: number; similarUserLimit?: number; category?: string; availableSizes?: Size[] }));
    } else {
      dispatch(showMeasurementsForm());
    }
  }, [dispatch, measurements, productId, category, availableSizes]);

  const handleShowForm = useCallback(() => {
    dispatch(showMeasurementsForm());
  }, [dispatch]);

  const handleHideForm = useCallback(() => {
    dispatch(hideMeasurementsForm());
  }, [dispatch]);

  const loading = measurementsLoading || recommendationLoading;

  return (
    <SizeRecommendationPresenter
      measurements={measurements}
      recommendation={recommendation}
      category={category}
      availableSizes={availableSizes}
      loading={loading}
      error={recommendationError}
      showForm={showForm}
      onShowForm={handleShowForm}
      onHideForm={handleHideForm}
      onSaveMeasurements={handleSaveMeasurements}
      onGetRecommendation={handleGetRecommendation}
      onSizeSelect={onSizeSelect}
    />
  );
};

export default SizeRecommendationContainer;
