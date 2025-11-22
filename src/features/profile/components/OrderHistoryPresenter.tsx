'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, PaginatedResponse } from '@/features/order/types';
import { useEnums } from '@/hooks/useEnums';
import { Pagination } from '@/features/filter-product/components/Pagination';

interface OrderHistoryPresenterProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination?: PaginatedResponse<Order> | null;
  onReload: () => void;
  onPageChange?: (page: number) => void;
  onOpenDetail?: (order: Order) => void;
  onTrack?: (order: Order) => void;
  onPayAgain?: (paymentId: number, orderId: number) => void;
  onReview?: (order: Order) => void;
  imagesByDetailId?: Record<number, string>;
}

export const OrderHistoryPresenter: React.FC<OrderHistoryPresenterProps> = ({ 
  orders, 
  loading, 
  error, 
  pagination, 
  onReload, 
  onPageChange, 
  onOpenDetail, 
  onTrack,
  onPayAgain,
  onReview,
  imagesByDetailId 
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const { data: enums } = useEnums();
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
  const formatDate = (iso: string) => new Date(iso).toLocaleString('vi-VN');

  const getPaymentBadgeClass = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'PARTIALLY_REFUNDED':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'UNPAID':
      default:
        return 'bg-red-100 text-red-700 border border-red-200';
    }
  };

  const getShipmentStatus = (order: Order) => {
    if (!order.shipments || order.shipments.length === 0) return 'PENDING';
    const latest = [...order.shipments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).at(-1);
    return latest?.status || 'PENDING';
  };

  const canPayAgain = (order: Order) => {
    return (order.paymentStatus === 'UNPAID' || order.status === 'CANCELLED') && 
           order.payments && 
           order.payments.length > 0 && 
           order.payments[0].provider === 'STRIPE' &&
           order.payments[0].id;
  };

  const getPayAgainButtonClass = (order: Order) => {
    if (canPayAgain(order)) {
      return "text-xs sm:text-sm font-medium text-black border border-transparent hover:text-red-600 hover:border-red-300 hover:bg-red-50 px-2 sm:px-3 py-1 rounded cursor-pointer transition-colors";
    }
    return "text-xs sm:text-sm font-medium text-gray-400 border border-transparent hover:border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-1 rounded cursor-not-allowed transition-colors";
  };

  const getPayAgainButtonTitle = (order: Order) => {
    if (canPayAgain(order)) {
      return "Pay again for this order";
    }
    return "Payment not available for this order";
  };

  // Check if order is completed (fulfilled)
  const isCompleted = (order: Order) => {
    return order.status === OrderStatus.FULFILLED;
  };

  const getReviewButtonClass = (order: Order) => {
    if (isCompleted(order)) {
      return "text-xs sm:text-sm font-medium text-black border border-gray-300 sm:border-transparent hover:bg-gray-50 sm:hover:border-gray-300 px-2 sm:px-3 py-1.5 sm:py-1 rounded cursor-pointer transition-colors";
    }
    return "text-xs sm:text-sm font-medium text-gray-400 border border-gray-300 sm:border-transparent bg-gray-50 sm:bg-transparent sm:hover:border-gray-300 sm:hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-1 rounded cursor-not-allowed transition-colors";
  };

  const getReviewButtonTitle = (order: Order) => {
    if (isCompleted(order)) {
      return "Write a review for this order";
    }
    return "Only fulfilled orders can be reviewed";
  };


  const toggleExpand = (orderId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Skeleton loader for orders
  const renderOrderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          {/* Desktop skeleton */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[64px_200px_auto_160px] gap-x-2 mb-3">
              <div className="h-5 bg-gray-300 rounded w-16" />
              <div className="h-5 bg-gray-300 rounded w-32" />
              <div className="h-5 bg-gray-300 rounded w-24" />
              <div className="h-5 bg-gray-300 rounded w-36" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-5 bg-gray-300 rounded w-32" />
              <div className="h-8 bg-gray-300 rounded w-28" />
              <div className="h-8 bg-gray-300 rounded w-28" />
              <div className="h-8 bg-gray-300 rounded w-24" />
            </div>
          </div>
          
          {/* Mobile skeleton */}
          <div className="lg:hidden space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-20" />
                <div className="h-4 bg-gray-300 rounded w-32" />
              </div>
              <div className="h-5 bg-gray-300 rounded w-28" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-300 rounded w-24" />
              <div className="h-6 bg-gray-300 rounded w-32" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 bg-gray-300 rounded" />
              <div className="h-9 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="border-t-3 border-black">
        <div className="px-2 sm:px-4 pt-4 sm:pt-6">
          {renderOrderSkeleton()}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={onReload} className="px-3 py-1 text-sm font-medium bg-black text-white rounded">Reload</button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-gray-600">
        <div className="mb-4">You have no orders yet.</div>
        <button onClick={onReload} className="px-3 py-1 text-sm font-medium bg-black text-white rounded">Reload</button>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 border-t-3 border-black">
      <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        {orders.map(order => (
          <div key={order.id} className="border-b border-gray-200 pb-4 sm:pb-6">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Compact Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="font-bold text-black text-sm">#{order.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap min-w-[60px] text-center ${getPaymentBadgeClass(order.paymentStatus)}`}>
                      {enums?.paymentStatus?.[order.paymentStatus] || order.paymentStatus}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-gray-100 text-gray-700 border border-gray-200">
                      {getShipmentStatus(order)}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">{formatDate(order.createdAt)}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-black font-bold text-sm">{formatPrice(order.totalAmount)}</div>
                </div>
              </div>

              {/* Actions - Compact buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleExpand(order.id)}
                  className="flex-1 text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                >
                  {expandedIds.has(order.id) ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDetail?.(order)}
                  className="text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => canPayAgain(order) && onPayAgain?.(order.payments[0].id, order.id)}
                  disabled={!canPayAgain(order)}
                  className={`text-xs font-medium px-2 py-1.5 rounded transition-colors ${
                    canPayAgain(order) 
                      ? 'text-red-600 border border-red-300 hover:bg-red-50' 
                      : 'text-gray-400 border border-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  Pay
                </button>
                <button
                  type="button"
                  onClick={() => isCompleted(order) && onReview?.(order)}
                  disabled={!isCompleted(order)}
                  className={getReviewButtonClass(order)}
                  title={getReviewButtonTitle(order)}
                >
                  Review
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-4">
              <div
                className="grid grid-cols-[64px_200px_auto_160px] justify-items-start items-center gap-y-3 gap-x-2 cursor-pointer select-none"
                onClick={() => toggleExpand(order.id)}
                title={expandedIds.has(order.id) ? 'Hide details' : 'Show details'}
              >
                <span className="font-semibold text-black">V{order.id}</span>
                <span className="whitespace-nowrap">{formatDate(order.createdAt)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ml-2 min-w-[80px] text-center ${getPaymentBadgeClass(order.paymentStatus)}`}>
                  {enums?.paymentStatus?.[order.paymentStatus] || order.paymentStatus}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-700 border border-gray-200`}>Shipping: {getShipmentStatus(order)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-black font-semibold">Total: {formatPrice(order.totalAmount)}</span>
                <button
                  type="button"
                  onClick={() => onOpenDetail?.(order)}
                  className="text-sm font-medium text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 px-3 py-1 rounded cursor-pointer transition-colors"
                >
                  Order Details
                </button>
                <button
                  type="button"
                  onClick={() => onTrack?.(order)}
                  className="text-sm font-medium text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 px-3 py-1 rounded cursor-pointer transition-colors"
                  title="Track shipment"
                >
                  Track Order
                </button>
                <button
                  type="button"
                  onClick={() => canPayAgain(order) && onPayAgain?.(order.payments[0].id, order.id)}
                  className={getPayAgainButtonClass(order)}
                  title={getPayAgainButtonTitle(order)}
                  disabled={!canPayAgain(order)}
                >
                  Pay Again
                </button>
                <button
                  type="button"
                  onClick={() => isCompleted(order) && onReview?.(order)}
                  disabled={!isCompleted(order)}
                  className={getReviewButtonClass(order)}
                  title={getReviewButtonTitle(order)}
                >
                  Review
                </button>
              </div>
            </div>

            {expandedIds.has(order.id) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {/* Mobile: Simple compact list */}
                <div className="space-y-3 lg:hidden">
                  {order.orderDetails.map(detail => (
                    <div key={detail.id} className="flex gap-2">
                      <div className="w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100" style={{ aspectRatio: '4 / 5' }}>
                        <img 
                          src={imagesByDetailId?.[detail.productDetailId] || detail.imageUrl || '/images/products/image1.jpg'} 
                          alt={detail.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-black font-semibold text-xs line-clamp-2 leading-tight mb-1">{detail.title}</div>
                        <div className="text-[10px] text-gray-500">{detail.colorLabel} / {detail.sizeLabel}</div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-gray-600">x{detail.quantity}</span>
                          {detail.finalPrice && detail.finalPrice !== detail.unitPrice ? (
                            <div className="flex items-center gap-1">
                              <span className="text-black font-bold text-xs">{formatPrice(detail.finalPrice)}</span>
                              {detail.percentOff && (
                                <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[9px] font-medium">
                                  -{detail.percentOff}%
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-black font-bold text-xs">{formatPrice(detail.unitPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Full details */}
                <div className="hidden lg:block space-y-6">
                  {order.orderDetails.map(detail => (
                    <div key={detail.id} className="flex gap-4">
                      <div className="w-20 xl:w-24 rounded overflow-hidden flex-shrink-0 bg-gray-100" style={{ aspectRatio: '4 / 5' }}>
                        <img 
                          src={imagesByDetailId?.[detail.productDetailId] || detail.imageUrl || '/images/products/image1.jpg'} 
                          alt={detail.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-black font-semibold text-base line-clamp-2">{detail.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{detail.colorLabel} / {detail.sizeLabel}</div>
                        <div className="text-xs text-gray-600 mt-1">Quantity: {detail.quantity}</div>
                        
                        <div className="mt-2">
                          {detail.finalPrice && detail.finalPrice !== detail.unitPrice ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-black font-bold text-base">
                                {formatPrice(detail.finalPrice)}
                              </div>
                              <div className="text-sm line-through text-gray-500">
                                {formatPrice(detail.unitPrice)}
                              </div>
                              {detail.percentOff && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  -{detail.percentOff}%
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-black font-bold text-base">
                              {formatPrice(detail.unitPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && onPageChange && pagination.totalPages > 1 && (
        <div className="mt-4 pt-2">
          <Pagination
            currentPage={pagination.number + 1} 
            totalPages={pagination.totalPages}
            hasNext={!pagination.last}
            hasPrevious={!pagination.first}
            onPageChange={(page) => onPageChange(page - 1)} 
          />
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPresenter;


