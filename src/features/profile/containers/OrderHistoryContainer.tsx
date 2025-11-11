'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderQueryParams } from '@/features/order/types';
import { OrderHistoryPresenter } from '../components/OrderHistoryPresenter';
import { OrderFilters } from '../components/OrderFilters';
import { useOrders } from '@/hooks/useOrders';
import { useMinimumLoadingTime } from '@/hooks/useMinimumLoadingTime';
import { productApi } from '@/services/api/productApi';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/features/auth/login/redux/loginSlice';
import { ReviewModal } from '@/components/modals/ReviewModal';

export const OrderHistoryContainer: React.FC<{
  onOpenDetail?: (order: Order) => void,
  onTrack?: (order: Order) => void,
  onPayAgain?: (paymentId: number, orderId: number) => void,
  onReview?: (order: Order) => void
}> = ({ onOpenDetail, onTrack, onPayAgain, onReview }) => {
  const { orders, loading, error, pagination, currentQuery, fetchOrders } = useOrders();
  const user = useAppSelector(selectUser);
  
  // Use minimum loading time hook to ensure skeleton shows for at least 500ms
  const displayLoading = useMinimumLoadingTime(loading, 500);
  const [imagesByDetailId, setImagesByDetailId] = useState<Record<number, string>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [query, setQuery] = useState<OrderQueryParams>({
    userId: user?.id ? Number(user.id) : undefined,
    sortBy: 'createdAt',
    direction: 'desc',
    page: 0,
    size: 10
  });

  useEffect(() => {
    if (user?.id) {
      const queryWithUserId = { ...query, userId: Number(user.id) };
      setQuery(queryWithUserId);
      fetchOrders(queryWithUserId);
    }
  }, [user?.id]);

  // Fetch product images when orders change
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setImagesByDetailId({});
      return;
    }

    // Collect all unique productDetailIds from all orders
    const allDetailIds = new Set<number>();
    orders.forEach(order => {
      order.orderDetails?.forEach(detail => {
        allDetailIds.add(detail.productDetailId);
      });
    });

    const uniqueDetailIds = Array.from(allDetailIds);
    if (uniqueDetailIds.length === 0) return;

    let cancelled = false;
    Promise.all(uniqueDetailIds.map(detailId =>
      productApi.getProductById(String(detailId))
        .then(r => ({ id: detailId, img: r.success ? (r.data?.images?.[0] || '') : '' }))
        .catch(() => ({ id: detailId, img: '' }))
    ))
      .then(results => {
        if (cancelled) return;
        const map: Record<number, string> = {};
        results.forEach(({ id, img }) => { if (img) map[id] = img; });
        setImagesByDetailId(map);
      });

    return () => { cancelled = true; };
  }, [orders]);

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

  const handleApplyFilters = () => {
    const newQuery = { ...query, page: 0, userId: user?.id ? Number(user.id) : undefined };
    setQuery(newQuery);
    fetchOrders(newQuery);
  };

  const handleReviewClick = (order: Order) => {
    setSelectedOrderForReview(order);
    setIsReviewModalOpen(true);
  };

  const { reviewApiService } = require('@/services/api/reviewApi');
  const handleReviewSubmit = async (_orderId: number, reviews: { productDetailId: number; rating: number; comment: string }[]) => {
    // Gửi từng review tới API, chỉ truyền productDetailId, rating, comment
    for (const review of reviews) {
      await reviewApiService.createReview({
        productDetailId: review.productDetailId,
        rating: review.rating,
        content: review.comment,
      });
    }
    if (selectedOrderForReview) {
      onReview?.(selectedOrderForReview);
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
            onApplyFilters={handleApplyFilters}
            loading={displayLoading}
          />
        </div>
        
        {/* Mobile: Filters below title */}
        <div className="sm:hidden">
          <OrderFilters
            query={query}
            onQueryChange={handleQueryChange}
            onApplyFilters={handleApplyFilters}
            loading={displayLoading}
          />
        </div>
      </div>



      {/* Orders List */}
      <OrderHistoryPresenter
        orders={orders}
        loading={displayLoading}
        error={error}
        pagination={pagination}
        onReload={() => fetchOrders({ ...query, userId: user?.id ? Number(user.id) : undefined })}
        onPageChange={handlePageChange}
        onOpenDetail={onOpenDetail}
        onTrack={onTrack}
        onPayAgain={onPayAgain}
        onReview={handleReviewClick}
        imagesByDetailId={imagesByDetailId}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrderForReview}
        imagesByDetailId={imagesByDetailId}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default OrderHistoryContainer;


