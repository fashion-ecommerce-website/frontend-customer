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
  deleteReviewRequest,
  showDeleteConfirm,
  hideDeleteConfirm,
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
  selectConfirmDelete,
} from '../redux/reviewSlice';
import { ReviewContainerProps, ReviewFormData } from '../types/profile.types';

export const ReviewContainer: React.FC<ReviewContainerProps> = ({
  onEditSuccess,
  onEditError,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const dispatch = useAppDispatch();
  const [lastActionType, setLastActionType] = useState<'edit' | 'delete' | null>(null);
  
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
  // Delete confirmation modal
  const confirmDelete = useAppSelector(selectConfirmDelete);

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

  // Handle delete success
  useEffect(() => {
    if (submitSuccess && onDeleteSuccess && lastActionType === 'delete') {
      onDeleteSuccess();
      // Clear success state after showing toast
      setTimeout(() => {
        dispatch(clearSuccess());
        setLastActionType(null);
      }, 100);
    }
  }, [submitSuccess, onDeleteSuccess, dispatch, lastActionType]);

  // Handle delete error
  useEffect(() => {
    if (error && onDeleteError) {
      onDeleteError(error);
    }
  }, [error, onDeleteError]);

  // Handle edit review
  const handleEditReview = useCallback((reviewId: string, data: ReviewFormData) => {
    setLastActionType('edit');
    dispatch(updateReviewRequest({ reviewId, data }));
  }, [dispatch]);

  // Handle delete review
  const handleDeleteReview = useCallback((reviewId: string) => {
    setLastActionType('delete');
    dispatch(deleteReviewRequest(reviewId));
    dispatch(hideDeleteConfirm());
  }, [dispatch]);

  // Handle confirm delete (show modal)
  const handleConfirmDelete = useCallback((reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      dispatch(showDeleteConfirm({ reviewId, productName: review.productName }));
    }
  }, [dispatch, reviews]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    dispatch(hideDeleteConfirm());
  }, [dispatch]);

  // Handle clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle clear success
  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccess());
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
      confirmDelete={confirmDelete}
      onPageChange={handlePageChange}
      onEditReview={handleEditReview}
      onDeleteReview={handleDeleteReview}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleCancelDelete}
      onClearError={handleClearError}
    />
  );
};
