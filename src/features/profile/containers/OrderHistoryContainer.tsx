'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderQueryParams } from '@/features/order/types';
import { OrderHistoryPresenter } from '../components/OrderHistoryPresenter';
import { OrderFilters } from '../components/OrderFilters';
import { useOrders } from '@/hooks/useOrders';
import { productApi } from '@/services/api/productApi';

export const OrderHistoryContainer: React.FC<{ onOpenDetail?: (order: Order) => void, onTrack?: (order: Order) => void }> = ({ onOpenDetail, onTrack }) => {
  const { orders, loading, error, pagination, currentQuery, fetchOrders } = useOrders();
  const [showFilters, setShowFilters] = useState(false);
  const [imagesByDetailId, setImagesByDetailId] = useState<Record<number, string>>({});
  const [query, setQuery] = useState<OrderQueryParams>({
    sortBy: 'createdAt',
    direction: 'desc',
    page: 0,
    size: 10
  });

  useEffect(() => {
    fetchOrders(query);
  }, [fetchOrders]);

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
    const newQuery = { ...query, page };
    setQuery(newQuery);
    fetchOrders(newQuery);
  };

  // Note: Page size change removed as the existing Pagination component doesn't support it

  const handleQueryChange = (newQuery: OrderQueryParams) => {
    setQuery(newQuery);
  };

  const handleApplyFilters = () => {
    const newQuery = { ...query, page: 0 };
    setQuery(newQuery);
    fetchOrders(newQuery);
  };

  return (
    <div className="px-4">
      {/* Filter Toggle Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <OrderFilters
          query={query}
          onQueryChange={handleQueryChange}
          onApplyFilters={handleApplyFilters}
          loading={loading}
          className="mb-6"
        />
      )}

      {/* Orders List */}
      <OrderHistoryPresenter 
        orders={orders}
        loading={loading}
        error={error}
        pagination={pagination}
        onReload={() => fetchOrders(query)}
        onPageChange={handlePageChange}
        onOpenDetail={onOpenDetail}
        onTrack={onTrack}
        imagesByDetailId={imagesByDetailId}
      />
    </div>
  );
};

export default OrderHistoryContainer;


