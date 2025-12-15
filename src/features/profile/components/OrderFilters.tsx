import React from 'react';
import Image from 'next/image';
import { OrderQueryParams, OrderStatus, PaymentStatus } from '@/features/order/types';

// Status tab type
export type StatusTab = 'fulfilled' | 'cancelled' | 'paid' | 'unpaid' | 'refund';

interface OrderFiltersProps {
  query: OrderQueryParams;
  onQueryChange: (query: OrderQueryParams) => void;
  className?: string;
}

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refund', label: 'Refunded' },
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  query,
  onQueryChange,
  className = ''
}) => {

  const getCurrentStatusTab = (): StatusTab | null => {
    const status = query.status;
    const paymentStatus = query.paymentStatus;
    
    if (status === OrderStatus.FULFILLED) return 'fulfilled';
    if (status === OrderStatus.CANCELLED) return 'cancelled';
    if (paymentStatus === PaymentStatus.PAID) return 'paid';
    if (paymentStatus === PaymentStatus.UNPAID) return 'unpaid';
    if (paymentStatus === PaymentStatus.REFUNDED) return 'refund';
    
    return null; // No filter selected
  };

  const handleStatusTabChange = (value: StatusTab) => {
    const currentTab = getCurrentStatusTab();
    const newQuery = { ...query, page: 0 };
    
    // If clicking the same tab, do nothing (no deselect to show all)
    if (currentTab === value) {
      return;
    }
    
    if (value === 'fulfilled') {
      newQuery.status = OrderStatus.FULFILLED;
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

  const getCurrentSortValue = () => {
    const sortBy = query.sortBy || 'createdAt';
    const direction = query.direction || 'desc';
    
    if (sortBy === 'totalAmount') return 'totalAmount';
    if (sortBy === 'createdAt' && direction === 'desc') return 'new';
    if (sortBy === 'createdAt' && direction === 'asc') return 'old';
    
    return 'new';
  };

  const handleCombinedSortChange = (value: string) => {
    const newQuery = { ...query };
    
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

  const currentStatusTab = getCurrentStatusTab();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status Tabs */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusTabChange(tab.value)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                currentStatusTab === tab.value
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-shrink-0">
          <select
            value={getCurrentSortValue()}
            onChange={(e) => handleCombinedSortChange(e.target.value)}
            className="pl-7 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[11px] sm:text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-black bg-white appearance-none"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
            <option value="totalAmount">Amount</option>
          </select>
          <Image 
            width={12} 
            height={12} 
            src="https://img.icons8.com/ios-glyphs/30/sorting-arrows.png" 
            alt="sort"
            className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
