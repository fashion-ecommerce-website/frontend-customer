'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, PaginatedResponse } from '@/features/order/types';
import Image from 'next/image';
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
  onRefund?: (order: Order) => void;
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
  onRefund
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

  // Check if order is cancelled
  const isCancelled = (order: Order) => order.status === OrderStatus.CANCELLED;
  
  // Check if order is refunded
  const isRefunded = (order: Order) => order.paymentStatus === 'REFUNDED' || order.paymentStatus === 'PARTIALLY_REFUNDED';

  // Show Pay Again: only when UNPAID (not cancelled, not refunded)
  const showPayAgain = (order: Order) => {
    return order.paymentStatus === 'UNPAID' && 
           !isCancelled(order) &&
           order.payments && 
           order.payments.length > 0 && 
           order.payments[0].provider === 'STRIPE' &&
           order.payments[0].id;
  };

  // Show Refund: when PAID or FULFILLED (not cancelled, not refunded)
  const showRefund = (order: Order) => {
    return (order.paymentStatus === 'PAID' || order.status === OrderStatus.FULFILLED) && 
           !isCancelled(order) &&
           !isRefunded(order) &&
           order.payments && 
           order.payments.length > 0 && 
           order.payments[0].provider === 'STRIPE' &&
           order.payments[0].id;
  };

  // Show Review: when PAID or FULFILLED (not cancelled, not refunded, not unpaid)
  const showReview = (order: Order) => {
    return (order.paymentStatus === 'PAID' || order.status === OrderStatus.FULFILLED) && 
           !isCancelled(order) &&
           !isRefunded(order) &&
           order.paymentStatus !== 'UNPAID';
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

              {/* Actions */}
              <div className="space-y-2">
                {/* UNPAID: Show, Details, Track, Pay Again in 1 row */}
                {order.paymentStatus === 'UNPAID' && !isCancelled(order) && (
                  <div className="flex items-center gap-2">
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
                      className="flex-1 text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onTrack?.(order)}
                      className="flex-1 text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                    >
                      Track
                    </button>
                    <button
                      type="button"
                      onClick={() => showPayAgain(order) && onPayAgain?.(order.payments[0].id, order.id)}
                      disabled={!showPayAgain(order)}
                      className={`flex-1 text-xs font-medium px-2 py-1.5 rounded transition-colors ${
                        showPayAgain(order)
                          ? 'text-red-600 border border-red-300 hover:bg-red-50 cursor-pointer'
                          : 'text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Pay Again
                    </button>
                  </div>
                )}
                {/* Other statuses: Row 1 with Show, Details, Track */}
                {order.paymentStatus !== 'UNPAID' && (
                  <div className="flex items-center gap-2">
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
                      className="flex-1 text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onTrack?.(order)}
                      className="flex-1 text-xs font-medium text-black border border-gray-300 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                    >
                      Track
                    </button>
                  </div>
                )}
                {/* PAID/FULFILLED: Show Refund + Review */}
                {(order.paymentStatus === 'PAID' || order.status === OrderStatus.FULFILLED) && !isCancelled(order) && !isRefunded(order) && order.paymentStatus !== 'UNPAID' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showRefund(order) && onRefund?.(order)}
                      disabled={!showRefund(order)}
                      className={`flex-1 text-xs font-medium px-2 py-1.5 rounded transition-colors ${
                        showRefund(order)
                          ? 'text-black border border-gray-300 hover:bg-gray-50 cursor-pointer'
                          : 'text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => showReview(order) && onReview?.(order)}
                      disabled={!showReview(order)}
                      className={`flex-1 text-xs font-medium px-2 py-1.5 rounded transition-colors ${
                        showReview(order)
                          ? 'text-black border border-gray-300 hover:bg-gray-50 cursor-pointer'
                          : 'text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Review
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-4">
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => toggleExpand(order.id)}
                title={expandedIds.has(order.id) ? 'Hide details' : 'Show details'}
              >
                <span className="whitespace-nowrap">{formatDate(order.createdAt)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap min-w-[80px] text-center ${getPaymentBadgeClass(order.paymentStatus)}`}>
                  {enums?.paymentStatus?.[order.paymentStatus] || order.paymentStatus}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-700 border border-gray-200`}>Shipping: {getShipmentStatus(order)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black font-semibold">Total: {formatPrice(order.totalAmount)}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenDetail?.(order)}
                    className="text-sm font-medium text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onTrack?.(order)}
                    className="text-sm font-medium text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    Track
                  </button>
                  {/* UNPAID: Show Pay Again (red if STRIPE, gray if not) */}
                  {order.paymentStatus === 'UNPAID' && !isCancelled(order) && (
                    <button
                      type="button"
                      onClick={() => showPayAgain(order) && onPayAgain?.(order.payments[0].id, order.id)}
                      disabled={!showPayAgain(order)}
                      className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                        showPayAgain(order)
                          ? 'text-red-600 border border-transparent hover:border-red-300 hover:bg-red-50 cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Pay Again
                    </button>
                  )}
                  {/* PAID/FULFILLED: Show Refund + Review */}
                  {(order.paymentStatus === 'PAID' || order.status === OrderStatus.FULFILLED) && !isCancelled(order) && !isRefunded(order) && order.paymentStatus !== 'UNPAID' && (
                    <>
                      <button
                        type="button"
                        onClick={() => showRefund(order) && onRefund?.(order)}
                        disabled={!showRefund(order)}
                        className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                          showRefund(order)
                            ? 'text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Refund
                      </button>
                      <button
                        type="button"
                        onClick={() => showReview(order) && onReview?.(order)}
                        disabled={!showReview(order)}
                        className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                          showReview(order)
                            ? 'text-black border border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Review
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {expandedIds.has(order.id) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {/* Mobile: Simple compact list */}
                <div className="space-y-3 lg:hidden">
                  {order.orderDetails.map(detail => (
                    <div key={detail.id} className="flex gap-2">
                      <div className="w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100" style={{ aspectRatio: '4 / 5' }}>
                        <Image 
                          src={detail.images?.[0] || '/images/products/image1.jpg'} 
                          alt={detail.title} 
                          width={64}
                          height={80}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-black font-semibold text-xs line-clamp-2 leading-tight mb-1">{detail.title}</div>
                        <div className="text-[10px] text-gray-500">{detail.colorLabel} / {detail.sizeLabel}</div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-gray-600">x{detail.quantity}</span>
                          {detail.promotionId && detail.percentOff != null && detail.percentOff > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="text-black font-bold text-xs">{formatPrice(detail.unitPrice * (1 - detail.percentOff / 100))}</span>
                              <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[9px] font-medium">
                                -{detail.percentOff}%
                              </span>
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
                        <Image 
                          src={detail.images?.[0] || '/images/products/image1.jpg'} 
                          alt={detail.title} 
                          width={96}
                          height={120}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-black font-semibold text-base line-clamp-2">{detail.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{detail.colorLabel} / {detail.sizeLabel}</div>
                        <div className="text-xs text-gray-600 mt-1">Quantity: {detail.quantity}</div>
                        
                        <div className="mt-2">
                          {detail.promotionId && detail.percentOff != null && detail.percentOff > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-black font-bold text-base">
                                {formatPrice(detail.unitPrice * (1 - detail.percentOff / 100))}
                              </div>
                              <div className="text-sm line-through text-gray-500">
                                {formatPrice(detail.unitPrice)}
                              </div>
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                -{detail.percentOff}%
                              </span>
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


