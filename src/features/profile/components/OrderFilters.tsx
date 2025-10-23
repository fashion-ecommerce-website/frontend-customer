import React from 'react';
import { OrderQueryParams, OrderStatus, PaymentStatus } from '@/features/order/types';

interface OrderFiltersProps {
  query: OrderQueryParams;
  onQueryChange: (query: OrderQueryParams) => void;
  onApplyFilters: () => void;
  loading?: boolean;
  className?: string;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  query,
  onQueryChange,
  onApplyFilters,
  loading = false,
  className = ''
}) => {
  const handleFilterChange = (key: keyof OrderQueryParams, value: any) => {
    onQueryChange({
      ...query,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onQueryChange({
      sortBy: 'createdAt',
      direction: 'desc',
      page: 0,
      size: 10
    });
  };

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">Filter Orders</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Status
          </label>
          <select
            value={query.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">All</option>
            <option value={OrderStatus.UNFULFILLED}>Unfulfilled</option>
            <option value={OrderStatus.FULFILLED}>Fulfilled</option>
            <option value={OrderStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            value={query.paymentStatus || ''}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">All</option>
            <option value={PaymentStatus.UNPAID}>Unpaid</option>
            <option value={PaymentStatus.PAID}>Paid</option>
            <option value={PaymentStatus.REFUNDED}>Refunded</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={query.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="totalAmount">Total Amount</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Direction
          </label>
          <select
            value={query.direction || 'desc'}
            onChange={(e) => handleFilterChange('direction', e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end">
        <button
          onClick={onApplyFilters}
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
