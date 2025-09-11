'use client';

import React, { useState } from 'react';
import { ProductFilters, FilterDropdownOption } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearch: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onSearch
}) => {
  const [searchTitle, setSearchTitle] = useState(filters.title || '');

  const colorOptions: FilterDropdownOption[] = [
    { value: 'black', label: 'Đen' },
    { value: 'white', label: 'Trắng' },
    { value: 'red', label: 'Đỏ' },
    { value: 'blue', label: 'Xanh dương' },
    { value: 'dark blue', label: 'Xanh đậm' },
    { value: 'mint', label: 'Xanh mint' },
    { value: 'brown', label: 'Nâu' },
    { value: 'yellow', label: 'Vàng' },
  ];

  const sizeOptions: FilterDropdownOption[] = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ];

  const priceOptions: FilterDropdownOption[] = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '<1m', label: 'Dưới 1 triệu' },
    { value: '1-2m', label: '1-2 triệu' },
    { value: '2-3m', label: '2-3 triệu' },
    { value: '>4m', label: 'Trên 4 triệu' },
  ];

  const categoryOptions: FilterDropdownOption[] = [
    { value: 'ao-thun', label: 'Áo thun' },
    { value: 'ao-polo', label: 'Áo polo' },
    { value: 'ao-hoodie', label: 'Áo hoodie' },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleMultiSelectChange = (key: 'colors' | 'sizes', value: string) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const handleSearchSubmit = () => {
    handleFilterChange('title', searchTitle || undefined);
    onSearch();
  };

  const clearFilters = () => {
    setSearchTitle('');
    onFiltersChange({
      category: 'ao-thun',
      page: 1,
      pageSize: 12
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-black">Bộ lọc</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Tìm kiếm</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Màu sắc */}
          <div>
            <h4 className="text-sm font-medium text-black mb-3">Màu sắc</h4>
            <div className="space-y-2">
              {colorOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.colors?.includes(option.value) || false}
                    onChange={() => handleMultiSelectChange('colors', option.value)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Loại sản phẩm */}
          <div>
            <h4 className="text-sm font-medium text-black mb-3">Loại sản phẩm</h4>
            <div className="space-y-2">
              {categoryOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === option.value}
                    onChange={() => handleFilterChange('category', option.value)}
                    className="border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div>
            <h4 className="text-sm font-medium text-black mb-3">Kích thước</h4>
            <div className="space-y-2">
              {sizeOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.sizes?.includes(option.value) || false}
                    onChange={() => handleMultiSelectChange('sizes', option.value)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Giá */}
          <div>
            <h4 className="text-sm font-medium text-black mb-3">Giá</h4>
            <div className="space-y-2">
              {priceOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    checked={filters.price === option.value}
                    onChange={() => handleFilterChange('price', option.value || undefined)}
                    className="border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-black">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </>
  );
};
