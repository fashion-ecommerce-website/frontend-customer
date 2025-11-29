/**
 * Voucher Container Component
 * Smart component that handles business logic for user vouchers
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VoucherPresenter } from '../components/VoucherPresenter';
import { voucherApi } from '@/services/api/voucherApi';
import { Voucher } from '@/features/order/components/VoucherModal';

export const VoucherContainer: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user vouchers
  const loadVouchers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await voucherApi.getVouchersByUser();
      if (response.success && response.data) {
        setVouchers(response.data);
      } else {
        setError(response.message || 'Failed to load vouchers');
      }
    } catch (err) {
      setError('An error occurred while loading vouchers');
      console.error('Error loading vouchers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load vouchers on component mount
  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadVouchers();
  }, [loadVouchers]);

  return (
    <VoucherPresenter
      vouchers={vouchers}
      isLoading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    />
  );
};
