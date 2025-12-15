/**
 * Review Container Component
 * Smart component that handles business logic for review management
 */

'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useMinimumLoadingTime } from '@/hooks/useMinimumLoadingTime';
import { ReviewPresenter } from '../components/ReviewPresenter';
import {
  getReviewsRequest,
  updateReviewRequest,
  clearError,
  clearSuccess,
  selectReviews,
  selectTotalReviews,
  selectIsLoading,
  selectIsSubmitting,
  selectError,
  selectSubmitSuccess,
  selectCurrentPage,
  selectTotalPages,
  selectHasNext,
  selectHasPrevious,
} from '../redux/reviewSlice';
import { ReviewContainerProps, ReviewFormData } from '../types/profile.types';

export const ReviewContainer: React.FC<ReviewContainerProps> = ({
  onEditSuccess,
  onEditError,
}) => {
  const dispatch = useAppDispatch();
  const [lastActionType, setLastActionType] = useState<'edit' | null>(null);
  
  // Redux state
  const reviews = useAppSelector(selectReviews);
  const totalReviews = useAppSelector(selectTotalReviews);
  const isLoading = useAppSelector(selectIsLoading);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const error = useAppSelector(selectError);
  const submitSuccess = useAppSelector(selectSubmitSuccess);
  
  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(isLoading, 500);
  
  // Pagination state
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const hasNext = useAppSelector(selectHasNext);
  const hasPrevious = useAppSelector(selectHasPrevious);

  // Load reviews on component mount
  useEffect(() => {
    dispatch(getReviewsRequest({ page: 1 }));
  }, [dispatch]);

  // Handle successful edit
  useEffect(() => {
    if (submitSuccess && onEditSuccess && lastActionType === 'edit') {
      onEditSuccess();
      // Clear success state after showing toast
      setTimeout(() => {
        dispatch(clearSuccess());
        setLastActionType(null);
      }, 100);
    }
  }, [submitSuccess, onEditSuccess, dispatch, lastActionType]);

  // Handle edit error
  useEffect(() => {
    if (error && onEditError) {
      onEditError(error);
    }
  }, [error, onEditError]);

  // Handle edit review
  const handleEditReview = useCallback((reviewId: string, data: ReviewFormData) => {
    setLastActionType('edit');
    dispatch(updateReviewRequest({ reviewId, data }));
  }, [dispatch]);

  // Handle clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    dispatch(getReviewsRequest({ page }));
  }, [dispatch]);

  return (
    <ReviewPresenter
      reviews={reviews}
      totalReviews={totalReviews}
      isLoading={displayLoading}
      isSubmitting={isSubmitting}
      error={error}
      submitSuccess={submitSuccess}
      lastActionType={lastActionType}
      currentPage={currentPage}
      totalPages={totalPages}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      onPageChange={handlePageChange}
      onEditReview={handleEditReview}
      onClearError={handleClearError}
    />
  );
};
