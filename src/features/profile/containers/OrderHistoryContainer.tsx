'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Order, OrderQueryParams, OrderStatus } from '@/features/order/types';
import { OrderHistoryPresenter } from '../components/OrderHistoryPresenter';
import { OrderFilters } from '../components/OrderFilters';
import { useOrders } from '@/hooks/useOrders';
import { useMinimumLoadingTime } from '@/hooks/useMinimumLoadingTime';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/features/auth/login/redux/loginSlice';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { reviewApiService } from '@/services/api/reviewApi';
import { RefundModal } from '@/components/modals/RefundModal';
import { RefundApi } from '@/services/api/refundApi';

export const OrderHistoryContainer: React.FC<{
  onOpenDetail?: (order: Order) => void,
  onTrack?: (order: Order) => void,
  onPayAgain?: (paymentId: number, orderId: number) => void,
  onReview?: (order: Order) => void
}> = ({ onOpenDetail, onTrack, onPayAgain, onReview }) => {
  const { orders, loading, error, pagination, fetchOrders } = useOrders();
  const user = useAppSelector(selectUser);
  
  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(loading, 500);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [query, setQuery] = useState<OrderQueryParams>({
    userId: user?.id ? Number(user.id) : undefined,
    sortBy: 'createdAt',
    direction: 'desc',
    page: 0,
    size: 10,
    status: OrderStatus.UNFULFILLED // Default to Unfulfilled tab
  });
  const [initialized, setInitialized] = useState(false);

  // Filter orders based on selected tab
  const filteredOrders = useMemo(() => {
    // Fulfilled tab: exclude REFUNDED orders
    if (query.status === OrderStatus.FULFILLED) {
      return orders.filter(
        (order) =>
          order.paymentStatus !== 'REFUNDED' &&
          order.paymentStatus !== 'PARTIALLY_REFUNDED'
      );
    }
    // Unpaid tab: exclude CANCELLED orders
    if (query.paymentStatus === 'UNPAID') {
      return orders.filter((order) => order.status !== OrderStatus.CANCELLED);
    }
    return orders;
  }, [orders, query.status, query.paymentStatus]);

  useEffect(() => {
    if (user?.id && !initialized) {
      const queryWithUserId = {
        userId: Number(user.id),
        sortBy: 'createdAt' as const,
        direction: 'desc' as const,
        page: 0,
        size: 10,
        status: OrderStatus.UNFULFILLED // Default to Unfulfilled tab
      };
      setQuery(queryWithUserId);
      fetchOrders(queryWithUserId);
      setInitialized(true);
    }
  }, [user?.id, initialized, fetchOrders]);

  const handlePageChange = (page: number) => {
    const newQuery = { ...query, page, userId: user?.id ? Number(user.id) : undefined };
    setQuery(newQuery);
    fetchOrders(newQuery);
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Note: Page size change removed as the existing Pagination component doesn't support it

  const handleQueryChange = (newQuery: OrderQueryParams) => {
    const updatedQuery = { ...newQuery, userId: user?.id ? Number(user.id) : undefined };
    setQuery(updatedQuery);
    fetchOrders(updatedQuery);
  };

  const handleReviewClick = (order: Order) => {
    setSelectedOrderForReview(order);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (orderId: number, reviews: { orderId: number; orderDetailId: number; rating: number; comment: string }[]) => {
    // Gửi từng review tới API với orderId và orderDetailId
    // Return response của review cuối cùng để Modal biết kết quả
    let lastResponse: { success: boolean; message?: string } = { success: false };
    
    for (const review of reviews) {
      const response = await reviewApiService.createReview({
        orderId: review.orderId,
        orderDetailId: review.orderDetailId,
        rating: review.rating,
        content: review.comment,
      });
      lastResponse = response;
      
      // Nếu có lỗi, return ngay để Modal hiển thị error
      if (!response.success) {
        return response;
      }
    }
    
    if (selectedOrderForReview) {
      onReview?.(selectedOrderForReview);
    }
    
    return lastResponse;
  };

  const handleRefundClick = (order: Order) => {
    setSelectedOrderForRefund(order);
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async (orderId: number, reason: string, refundAmount: number) => {
    setRefundLoading(true);
    try {
      const response = await RefundApi.createRefund({
        orderId,
        reason,
        refundAmount,
      });

      if (response.success) {
        // Reload orders to reflect the updated status
        fetchOrders({ ...query, userId: user?.id ? Number(user.id) : undefined });
        setIsRefundModalOpen(false);
        setSelectedOrderForRefund(null);
      } else {
        throw new Error(response.message || 'Failed to submit refund request');
      }
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <div className="px-2 sm:px-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        {/* Title - Full width on mobile */}
        <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0 sm:hidden">Order History</h2>
        
        {/* Desktop: Side by side */}
        <div className="hidden sm:flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
          <OrderFilters
            query={query}
            onQueryChange={handleQueryChange}
            // onApplyFilters={handleApplyFilters}
            // loading={displayLoading}
          />
        </div>
        
        {/* Mobile: Filters below title */}
        <div className="sm:hidden">
          <OrderFilters
            query={query}
            onQueryChange={handleQueryChange}
            // onApplyFilters={handleApplyFilters}
            // loading={displayLoading}
          />
        </div>
      </div>



      {/* Orders List */}
      <OrderHistoryPresenter
        orders={filteredOrders}
        loading={displayLoading}
        error={error}
        pagination={pagination}
        onReload={() => fetchOrders({ ...query, userId: user?.id ? Number(user.id) : undefined })}
        onPageChange={handlePageChange}
        onOpenDetail={onOpenDetail}
        onTrack={onTrack}
        onPayAgain={onPayAgain}
        onReview={handleReviewClick}
        onRefund={handleRefundClick}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrderForReview}
        onSubmit={handleReviewSubmit}
      />

      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedOrderForRefund(null);
        }}
        order={selectedOrderForRefund}
        onConfirm={handleRefundConfirm}
        loading={refundLoading}
      />
    </div>
  );
};

export default OrderHistoryContainer;


