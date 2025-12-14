/**
 * Refund Container Component
 * Smart component that handles business logic for refund management
 * Fetches refund requests from /api/refunds/current-user
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { RefundPresenter } from '../components/RefundPresenter';
import type { RefundItem, RefundQueryParams, RefundStatus } from '../types/refund.types';
import { RefundApi } from '@/services/api/refundApi';
import { useMinimumLoadingTime } from '@/hooks/useMinimumLoadingTime';

export const RefundContainer: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(loading, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState<RefundQueryParams>({
    page: 0,
    size: 10,
  });

  // Fetch refund requests from API
  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await RefundApi.getCurrentUserRefunds({
        page: query.page,
        size: query.size,
        status: query.status,
      });

      if (response.success && response.data) {
        setRefunds(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch refund requests');
        setRefunds([]);
      }
    } catch (err) {
      console.error('Error fetching refunds:', err);
      setError('Unable to load refund requests. Please try again later.');
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQuery({ ...query, page: page - 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (status?: RefundStatus) => {
    setQuery({ ...query, status, page: 0 });
    setCurrentPage(1);
  };

  const handleReload = () => {
    fetchRefunds();
  };

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
