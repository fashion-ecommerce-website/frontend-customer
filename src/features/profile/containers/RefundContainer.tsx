/**
 * Refund Container Component
 * Smart component that handles business logic for refund management
 * Uses Redux/Saga for state management
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefundPresenter } from '../components/RefundPresenter';
import type { RefundStatus } from '../types/refund.types';
import {
  fetchRefundsRequest,
  setFilter,
  setPage,
  selectRefunds,
  selectRefundsLoading,
  selectRefundsError,
  selectCurrentPage,
  selectTotalPages,
} from '../redux/refundSlice';
import { useMinimumLoadingTime } from '@/hooks/useMinimumLoadingTime';

export const RefundContainer: React.FC = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const refunds = useSelector(selectRefunds);
  const loading = useSelector(selectRefundsLoading);
  const error = useSelector(selectRefundsError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  
  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(loading, 500);

  // Fetch refunds on mount
  useEffect(() => {
    dispatch(fetchRefundsRequest(undefined));
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setPage(page));
    dispatch(fetchRefundsRequest(undefined));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const handleFilterChange = useCallback((status?: RefundStatus) => {
    dispatch(setFilter(status));
    dispatch(fetchRefundsRequest(undefined));
  }, [dispatch]);

  const handleReload = useCallback(() => {
    dispatch(fetchRefundsRequest(undefined));
  }, [dispatch]);

  return (
    <RefundPresenter
      refunds={refunds}
      loading={displayLoading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      hasNext={currentPage < totalPages}
      hasPrevious={currentPage > 1}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      onReload={handleReload}
    />
  );
};

export default RefundContainer;
