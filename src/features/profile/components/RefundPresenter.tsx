/**
 * Refund Presenter Component
 * Pure UI component for displaying refund requests
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { RefundPresenterProps } from '../types/refund.types';
import { Pagination } from '../../filter-product/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const RefundPresenter: React.FC<RefundPresenterProps> = ({
  refunds,
  loading,
  error,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
  onFilterChange,
  onReload,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);

  const formatDate = (iso: string) => 
    new Date(iso).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterStatus(value);
    onFilterChange(value === 'all' ? undefined : value as 'pending' | 'approved' | 'rejected' | 'completed');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4 flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={onReload} 
            className="px-3 py-1 text-sm font-medium bg-black text-white rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 pb-2 border-b-3 border-black">
          <h2 className="text-base sm:text-xl font-semibold text-black">
            My Refund Requests
          </h2>
          
          {/* Filter */}
          <div className="w-full sm:w-48">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="w-full h-10 sm:h-11 rounded border border-gray-300 px-3 text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-xs sm:text-sm text-gray-600">
          View and track your refund requests. Processing typically takes 3-7 business days.
        </p>
      </div>

      {/* Refunds List */}
      {refunds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <p className="text-sm text-gray-400">No refund requests found</p>
          <p className="mt-1 text-xs sm:text-sm text-gray-400">You haven&apos;t made any refund requests yet</p>
          <button
            onClick={onReload}
            className="mt-4 px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Reload
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {refunds.map((refund) => (
              <div key={refund.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow bg-white">
                {/* Mobile Layout */}
                <div className="lg:hidden p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">
                        <span className="font-semibold text-black">#{refund.id}</span>
                        <span className="mx-1">•</span>
                        <span>Order V{refund.orderId}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{formatDate(refund.requestedAt)}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ml-2 ${getStatusBadgeClass(refund.status)}`}>
                      {getStatusLabel(refund.status)}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-2.5 mb-3">
                    {refund.productImage && (
                      <div className="relative w-14 h-14 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <Image src={refund.productImage} alt={refund.productName} fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-black line-clamp-2 mb-1">{refund.productName}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        {refund.colorLabel && <span>{refund.colorLabel}</span>}
                        {refund.colorLabel && refund.sizeLabel && <span>•</span>}
                        {refund.sizeLabel && <span>{refund.sizeLabel}</span>}
                        <span>•</span>
                        <span>Qty: {refund.quantity}</span>
                      </div>
                      <div className="text-sm font-bold text-black">{formatPrice(refund.refundAmount)}</div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <div className="text-[10px] text-gray-500 mb-0.5">Reason:</div>
                    <div className="text-xs text-gray-800">{refund.reason}</div>
                  </div>

                  {/* Update Info */}
                  {refund.updatedAt && (
                    <div className="text-[10px] text-gray-500">
                      Updated: {formatDate(refund.updatedAt)}
                    </div>
                  )}

                  {/* Note */}
                  {refund.note && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-1.5 bg-blue-50 border border-blue-100 rounded p-2">
                        <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-medium text-blue-900 mb-0.5">Admin Note</div>
                          <p className="text-xs text-blue-800 leading-relaxed">{refund.note}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    {refund.productImage && (
                      <div className="relative w-20 h-20 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <Image src={refund.productImage} alt={refund.productName} fill sizes="80px" className="object-cover" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="text-base font-semibold text-black">{refund.productName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(refund.status)}`}>
                              {getStatusLabel(refund.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">#{refund.id}</span>
                            <span>•</span>
                            <span>Order V{refund.orderId}</span>
                            <span>•</span>
                            <span>{formatDate(refund.requestedAt)}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-black">{formatPrice(refund.refundAmount)}</div>
                          <div className="text-xs text-gray-500">Refund Amount</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-6 text-sm text-gray-700 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Variant:</span>
                          <span>
                            {refund.colorLabel}
                            {refund.colorLabel && refund.sizeLabel && ' / '}
                            {refund.sizeLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Qty:</span>
                          <span>{refund.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Reason:</span>
                          <span>{refund.reason}</span>
                        </div>
                        {refund.updatedAt && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Updated:</span>
                              <span className="text-xs">{formatDate(refund.updatedAt)}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Note */}
                      {refund.note && (
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-blue-900 mb-1">Admin Note</div>
                            <p className="text-sm text-blue-800 leading-relaxed">{refund.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RefundPresenter;
