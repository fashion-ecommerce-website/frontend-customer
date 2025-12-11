/**
 * Voucher Presenter Component
 * Pure UI component for displaying user vouchers
 */

'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Voucher } from '@/features/order/components/VoucherModal';
import { ErrorMessage } from '../../../components';
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
  const isExpired = React.useCallback((expiresAt: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }, []);

  // Check if voucher is available
  const isAvailable = React.useCallback((voucher: Voucher) => {
    if (voucher.available === false) return false;
    if (isExpired(voucher.expiresAt || '')) return false;
    return true;
  }, [isExpired]);

  // Get discount display text
  const getDiscountText = (voucher: Voucher) => {
    if (voucher.discountType === 'percent') {
      return `${voucher.value}% OFF`;
    } else {
      return `${voucher.value.toLocaleString('vi-VN')}₫ OFF`;
    }
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
  }, [vouchers, searchTerm, filterStatus, isAvailable, isExpired]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Skeleton loader for vouchers
  const renderVoucherSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex gap-4">
            {/* Left side - Icon */}
            <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
            
            {/* Middle - Voucher info */}
            <div className="flex-1 min-w-0">
              {/* Voucher name */}
              <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
              {/* Discount text */}
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
              {/* Min order */}
              <div className="h-3 bg-gray-300 rounded w-2/3 mb-3" />
              {/* Code */}
              <div className="h-8 bg-gray-300 rounded w-32" />
            </div>
            
            {/* Right side - Expiry */}
            <div className="text-right">
              <div className="h-3 bg-gray-300 rounded w-20 mb-1 ml-auto" />
              <div className="h-3 bg-gray-300 rounded w-24 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
            <h2 className="text-base sm:text-lg font-semibold text-black">
              Vouchers
            </h2>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">Search Vouchers</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    disabled
                    className="w-full h-10 sm:h-11 rounded border border-gray-300 px-3 pl-9 sm:pl-10 text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent opacity-50 cursor-not-allowed"
                  />
                  <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="sm:w-48">
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">Status</label>
                <select
                  disabled
                  className="w-full h-10 sm:h-11 rounded border border-gray-300 px-3 text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent opacity-50 cursor-not-allowed"
                >
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {renderVoucherSkeleton()}
      </div>
    );
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
            You don&apos;t have any vouchers yet. Check back later for new promotions and special offers!
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
    <div className="p-3 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-base sm:text-lg font-semibold text-black">
            {vouchers.length} Vouchers
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">Search Vouchers</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or code..."
                  className="w-full h-10 sm:h-11 rounded border border-gray-300 px-3 pl-9 sm:pl-10 text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="sm:w-48">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'expired' | 'unavailable')}
                className="w-full h-10 sm:h-11 rounded border border-gray-300 px-3 text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
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
                : 'You don&apos;t have any vouchers yet. Check back later for new promotions and special offers!'
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
          <div key={voucher.id} className="mb-4 sm:mb-6">
            <div className={`rounded-lg p-3 sm:p-4 border ${isAvailable(voucher) ? 'border-gray-200' : 'border-gray-200 opacity-60'} ${!isAvailable(voucher) && voucher.message ? 'rounded-b-none' : ''}`}>
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex items-start gap-2 mb-3">
                  <div className="relative h-8 w-8 flex-shrink-0">
                    <Image 
                      src="https://static.vecteezy.com/system/resources/thumbnails/002/191/986/small_2x/discount-voucher-outline-icon-thin-line-black-discount-voucher-icon-vector.jpg"
                      alt="Voucher"
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-sm font-semibold text-black flex-1 line-clamp-2">{voucher.label || voucher.code}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${isAvailable(voucher) ? 'text-black border-black' : 'text-gray-500 border-gray-400'}`}>
                        {isAvailable(voucher) ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Code: <span className="font-mono font-semibold">{voucher.code}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2.5 mb-3">
                  <div className="text-xl font-bold text-[rgb(187,146,68)] mb-1 text-center">
                    {getDiscountText(voucher)}
                  </div>
                  <div className="text-[10px] text-center text-gray-600">
                    {isAvailable(voucher) ? 'Ready to use' : 'Not available'}
                  </div>
                </div>
                
                <div className="space-y-1.5 mb-3 text-xs text-gray-600">
                  {voucher.minSubtotal && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Min. order: <span className="font-medium">{voucher.minSubtotal.toLocaleString('vi-VN')}₫</span></span>
                    </div>
                  )}
                  {voucher.maxDiscountAmount && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>Max discount: <span className="font-medium">{voucher.maxDiscountAmount.toLocaleString('vi-VN')}₫</span></span>
                    </div>
                  )}
                  {voucher.expiresAt && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Expires: <span className="font-medium">{formatDate(voucher.expiresAt)}</span></span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => copyToClipboard(voucher.code)}
                  disabled={!isAvailable(voucher)}
                  className={`w-full py-2.5 text-sm font-medium rounded transition-colors ${
                    isAvailable(voucher)
                      ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {copiedCode === voucher.code ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative h-10 w-10">
                        <Image 
                          src="https://static.vecteezy.com/system/resources/thumbnails/002/191/986/small_2x/discount-voucher-outline-icon-thin-line-black-discount-voucher-icon-vector.jpg"
                          alt="Voucher"
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
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
            </div>
            
            {!isAvailable(voucher) && voucher.message && (
              <div className="p-2.5 sm:p-3 bg-orange-50 border border-orange-200 border-t-0 rounded-b-lg flex items-center gap-2">
                <div className="flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] sm:text-xs font-bold">i</span>
                </div>
                <span className="text-[11px] sm:text-xs text-red-500 font-medium">{voucher.message}</span>
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
