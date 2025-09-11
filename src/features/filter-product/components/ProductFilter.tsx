'use client';

import React from 'react';
import { ProductFilters, FilterDropdownOption } from '../types';

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onOpenSidebar?: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onOpenSidebar
}) => {
  const sortOptions: FilterDropdownOption[] = [
    { value: 'productTitle_asc', label: 'Name: A-Z' },
    { value: 'productTitle_desc', label: 'Name: Z-A' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Oldest' },
    { value: 'popular', label: 'Newest' },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-black">
        <span className="text-gray-500">HOME</span>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">CATEGORY</span>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-black font-medium">T-SHIRT</span>
      </div>

      {/* Filter Button and Sort Dropdown */}
      <div className="flex items-center gap-4">
        {/* Filter Button */}
        <button 
          onClick={onOpenSidebar}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sort || 'productTitle_asc'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
