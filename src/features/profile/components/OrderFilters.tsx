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

  const getCurrentFilterValue = () => {
    const status = query.status;
    const paymentStatus = query.paymentStatus;
    
    if (status === OrderStatus.CANCELLED) return 'cancelled';
    if (paymentStatus === PaymentStatus.PAID) return 'paid';
    if (paymentStatus === PaymentStatus.UNPAID) return 'unpaid';
    if (paymentStatus === PaymentStatus.REFUNDED) return 'refund';
    
    return '';
  };

  const handleCombinedFilterChange = (value: string) => {
    let newQuery = { ...query };
    
    if (value === '') {
      // Clear all filters
      newQuery.status = undefined;
      newQuery.paymentStatus = undefined;
    } else if (value === 'cancelled') {
      newQuery.status = OrderStatus.CANCELLED;
      newQuery.paymentStatus = undefined;
    } else if (value === 'paid') {
      newQuery.status = undefined;
      newQuery.paymentStatus = PaymentStatus.PAID;
    } else if (value === 'unpaid') {
      newQuery.status = undefined;
      newQuery.paymentStatus = PaymentStatus.UNPAID;
    } else if (value === 'refund') {
      newQuery.status = undefined;
      newQuery.paymentStatus = PaymentStatus.REFUNDED;
    }
    
    onQueryChange(newQuery);
  };

  const getFilterLabel = () => {
    const status = query.status;
    const paymentStatus = query.paymentStatus;
    
    if (!status && !paymentStatus) return 'All Orders';
    
    // Map to display labels
    if (status === OrderStatus.CANCELLED) return 'Cancelled';
    if (paymentStatus === PaymentStatus.PAID) return 'Paid';
    if (paymentStatus === PaymentStatus.UNPAID) return 'Unpaid';
    if (paymentStatus === PaymentStatus.REFUNDED) return 'Refund';
    
    return 'All Orders';
  };

  const getCurrentSortValue = () => {
    const sortBy = query.sortBy || 'createdAt';
    const direction = query.direction || 'desc';
    
    if (sortBy === 'totalAmount') return 'totalAmount';
    if (sortBy === 'createdAt' && direction === 'desc') return 'new';
    if (sortBy === 'createdAt' && direction === 'asc') return 'old';
    
    return 'new'; // default
  };

  const handleCombinedSortChange = (value: string) => {
    let newQuery = { ...query };
    
    if (value === 'totalAmount') {
      newQuery.sortBy = 'totalAmount';
      newQuery.direction = 'desc';
    } else if (value === 'new') {
      newQuery.sortBy = 'createdAt';
      newQuery.direction = 'desc';
    } else if (value === 'old') {
      newQuery.sortBy = 'createdAt';
      newQuery.direction = 'asc';
    }
    
    onQueryChange(newQuery);
  };

  const getSortLabel = () => {
    const sortBy = query.sortBy || 'createdAt';
    const direction = query.direction || 'desc';
    
    if (sortBy === 'totalAmount') return 'Total Amount';
    if (sortBy === 'createdAt' && direction === 'desc') return 'New';
    if (sortBy === 'createdAt' && direction === 'asc') return 'Old';
    
    return 'New';
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Filter Dropdown */}
      <div className="relative">
        <select
          value={getCurrentFilterValue()}
          onChange={(e) => handleCombinedFilterChange(e.target.value)}
          className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white appearance-none"
        >
          <option value="">All</option>
          <option value="cancelled">Cancelled</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="refund">Refund</option>
        </select>
        <img 
          width="16" 
          height="16" 
          src="https://img.icons8.com/ios/50/filter.png" 
          alt="filter"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={getCurrentSortValue()}
          onChange={(e) => handleCombinedSortChange(e.target.value)}
          className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white appearance-none"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="totalAmount">Total Amount</option>
        </select>
        <img 
          width="16" 
          height="16" 
          src="https://img.icons8.com/ios-glyphs/30/sorting-arrows.png" 
          alt="sorting-arrows"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default OrderFilters;
