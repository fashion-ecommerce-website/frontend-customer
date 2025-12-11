/**
 * Refund Container Component
 * Smart component that handles business logic for refund management
 * Uses mock data pattern consistent with home page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { RefundPresenter } from '../components/RefundPresenter';
import { mockRefunds } from '../data/mockRefundData';
import type { RefundItem, RefundQueryParams } from '../types/refund.types';

export const RefundContainer: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState<RefundQueryParams>({
    sortBy: 'requestedAt',
    direction: 'desc',
    page: 0,
    size: 10,
  });

  // Fetch refunds with fallback to mock data (pattern from home page)
  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await refundApi.getMyRefunds(query);
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use mock data as fallback (same pattern as home page)
        setRefunds(mockRefunds);
        setTotalPages(1);
        setError(null);
      } catch (err) {
        setError('Failed to load refunds');
        console.error('Error fetching refunds:', err);
        // On error, still show mock data
        setRefunds(mockRefunds);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, [query]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQuery({ ...query, page: page - 1 });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (status?: 'pending' | 'approved' | 'rejected' | 'completed') => {
    setQuery({ ...query, status, page: 0 });
    setCurrentPage(1);
  };

  const handleReload = () => {
    setQuery({ ...query });
  };

  return (
    <RefundPresenter
      refunds={refunds}
      loading={loading}
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
