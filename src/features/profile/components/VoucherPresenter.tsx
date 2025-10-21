/**
 * Voucher Presenter Component
 * Pure UI component for displaying user vouchers
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Voucher } from '@/features/order/components/VoucherModal';
import { PageLoadingSpinner, ErrorMessage } from '../../../components';
import { Pagination } from '@/features/filter-product/components/Pagination';

interface VoucherPresenterProps {
  vouchers: Voucher[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const VoucherPresenter: React.FC<VoucherPresenterProps> = ({
  vouchers,
  isLoading,
  error,
  onRefresh,
}) => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'expired' | 'unavailable'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Copy code function
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if voucher is expired
  const isExpired = (expiresAt: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  // Check if voucher is available
  const isAvailable = (voucher: Voucher) => {
    if (voucher.available === false) return false;
    if (isExpired(voucher.expiresAt || '')) return false;
    return true;
  };

  // Get discount display text
  const getDiscountText = (voucher: Voucher) => {
    if (voucher.discountType === 'percent') {
      return `${voucher.value}% OFF`;
    } else {
      return `${voucher.value.toLocaleString('vi-VN')}₫ OFF`;
    }
  };

  // Get minimum order text
  const getMinOrderText = (voucher: Voucher) => {
    if (voucher.minSubtotal) {
      return `Min. order ${voucher.minSubtotal.toLocaleString('vi-VN')}₫`;
    }
    return '';
  };

  // Filter and search logic
  const filteredVouchers = useMemo(() => {
    let filtered = vouchers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(voucher => 
        voucher.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(voucher => {
        const available = isAvailable(voucher);
        const expired = isExpired(voucher.expiresAt || '');
        
        switch (filterStatus) {
          case 'available':
            return available;
          case 'expired':
            return expired;
          case 'unavailable':
            return !available && !expired;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [vouchers, searchTerm, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <ErrorMessage message={error} />
        <button
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-[rgb(187,146,68)] text-white rounded hover:bg-[rgb(160,120,50)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🏷️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No vouchers available</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You don't have any vouchers yet. Check back later for new promotions and special offers!
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Vouchers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">
            {vouchers.length} Vouchers
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Search Vouchers</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or code..."
                  className="w-full h-11 rounded border border-gray-300 px-3.5 pl-10 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(187,146,68)] focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="md:w-48">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full h-11 rounded border border-gray-300 px-3.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[rgb(187,146,68)] focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="expired">Expired</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {filteredVouchers.length !== vouchers.length && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredVouchers.length} of {vouchers.length} vouchers
            </div>
          )}
        </div>
      </div>

      {/* Vouchers List */}
      <div>
        {filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
         
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vouchers found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any vouchers yet. Check back later for new promotions and special offers!'
              }
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          paginatedVouchers.map((voucher) => (
          <div key={voucher.id} className="mb-6">
            <div className={`rounded-lg p-4 border ${isAvailable(voucher) ? 'border-gray-200' : 'border-gray-200 opacity-60'} ${!isAvailable(voucher) && voucher.message ? 'rounded-b-none' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src="https://static.vecteezy.com/system/resources/thumbnails/002/191/986/small_2x/discount-voucher-outline-icon-thin-line-black-discount-voucher-icon-vector.jpg"
                      alt="Voucher"
                      className="h-10 w-10"
                    />
                    <div className="text-black font-semibold truncate">{voucher.label || voucher.code}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${isAvailable(voucher) ? 'text-black border-black' : 'text-gray-500 border-gray-400'}`}>
                      {isAvailable(voucher) ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">Code: <span className="font-mono">{voucher.code}</span></div>
                  
                  {voucher.minSubtotal && (
                    <div className="text-xs text-gray-500 mb-1">Min. order: {voucher.minSubtotal.toLocaleString('vi-VN')}₫</div>
                  )}
                  
                  <div className="flex items-center gap-6 text-[11px] text-gray-600">
                    {voucher.maxDiscountAmount && (
                      <span>Max: {voucher.maxDiscountAmount.toLocaleString('vi-VN')}₫</span>
                    )}
                    {voucher.expiresAt && (
                      <span>Expires: {formatDate(voucher.expiresAt)}</span>
                    )}
                   
                  </div>
                </div>
                
                <div className="pl-4 flex flex-col items-end">
                  <div className="text-lg font-bold text-[rgb(187,146,68)] mb-2">
                    {getDiscountText(voucher)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {isAvailable(voucher) ? 'Ready to use' : 'Not available'}
                  </div>
                  <button
                    onClick={() => copyToClipboard(voucher.code)}
                    disabled={!isAvailable(voucher)}
                    className={`px-4 py-1 text-xs font-medium rounded transition-colors w-20 ${
                      isAvailable(voucher)
                        ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {copiedCode === voucher.code ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            
            {!isAvailable(voucher) && voucher.message && (
              <div className="p-3 bg-orange-50 border border-orange-200 border-t-0 rounded-b-lg flex items-center gap-2">
                <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <span className="text-xs text-red-500 font-medium">{voucher.message}</span>
              </div>
            )}
          </div>
        ))
        )}
      </div>

      {/* Pagination */}
      {filteredVouchers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={currentPage < totalPages}
          hasPrevious={currentPage > 1}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
