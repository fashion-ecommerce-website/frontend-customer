'use client';

import React, { useState } from 'react';
import { Order, PaginatedResponse } from '@/features/order/types';
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
      return "text-sm font-medium bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer";
    }
    return "text-sm font-medium bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 cursor-pointer opacity-60";
  };

  const getPayAgainButtonTitle = (order: Order) => {
    if (canPayAgain(order)) {
      return "Pay again for this order";
    }
    return "Payment not available for this order";
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

  if (loading) {
    return (
      <div className="px-4 py-8 ">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" />
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
    <div className="px-4 border-t-3 border-black">
      <div className="space-y-6 pt-6">
        {orders.map(order => (
          <div key={order.id} className="border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-4">
              <div
                className="grid grid-cols-[64px_200px_auto_160px] justify-items-start items-center gap-y-3 gap-x-2 cursor-pointer select-none"
                onClick={() => toggleExpand(order.id)}
                title={expandedIds.has(order.id) ? 'Hide details' : 'Show details'}
              >
                <span className="font-semibold text-black">V{order.id}</span>
                <span className="whitespace-nowrap">{formatDate(order.createdAt)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ml-2 ${getPaymentBadgeClass(order.paymentStatus)}`}>
                  {enums?.paymentStatus?.[order.paymentStatus] || order.paymentStatus}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-700 border border-gray-200`}>Shipping: {getShipmentStatus(order)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-black font-semibold">Total: {formatPrice(order.totalAmount)}</span>
                <button
                  type="button"
                  onClick={() => onOpenDetail?.(order)}
                  className="text-sm font-medium text-black hover:opacity-70 cursor-pointer"
                >
                  Order Details
                </button>
                <button
                  type="button"
                  onClick={() => onTrack?.(order)}
                  className="text-sm font-medium text-black hover:opacity-70 cursor-pointer"
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
              </div>
            </div>

            {expandedIds.has(order.id) && (
              <div className="space-y-6">
                {order.orderDetails.map(detail => (
                  <div key={detail.id} className="flex gap-4">
                    <div className="w-24 rounded overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                      <img 
                        src={imagesByDetailId?.[detail.productDetailId] || detail.imageUrl || '/images/products/image1.jpg'} 
                        alt={detail.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-black font-semibold">{detail.title}</div>
                      <div className="text-xs text-gray-500">{detail.colorLabel} / {detail.sizeLabel}</div>
                      <div className="text-xs text-gray-600 mt-1">Quantity: {detail.quantity}</div>
                      
                      {/* Price - Simple like product detail */}
                      <div className="mt-2">
                        {detail.finalPrice && detail.finalPrice !== detail.unitPrice ? (
                          <div className="flex items-center gap-2">
                            <div className="text-black font-semibold">
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
                          <div className="text-black font-semibold">
                            {formatPrice(detail.unitPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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


