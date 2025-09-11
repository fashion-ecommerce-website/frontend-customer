'use client';

import React, { useState } from 'react';
import { ProductFilters, FilterDropdownOption } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  const [searchTitle, setSearchTitle] = useState(filters.title || '');
  const [expandedSections, setExpandedSections] = useState({
    colors: false,
    category: false,
    sizes: false,
    price: false
  });

  const colorOptions: FilterDropdownOption[] = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'red', label: 'Red' },
    { value: 'gray', label: 'Gray' },
    { value: 'blue', label: 'Blue' },
    { value: 'pink', label: 'Pink' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'brown', label: 'Brown' },
    { value: 'green', label: 'Green' },
    { value: 'beige', label: 'Beige' },
    { value: 'orange', label: 'Orange' },
    { value: 'checkered', label: 'Checkered' },
  ];

  const sizeOptions: FilterDropdownOption[] = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ];

  const shoeSizeOptions: FilterDropdownOption[] = [
    { value: '36.5', label: '36.5' },
    { value: '37.5', label: '37.5' },
    { value: '38', label: '38' },
    { value: '38.5', label: '38.5' },
    { value: '39', label: '39' },
    { value: '40.5', label: '40.5' },
    { value: '41', label: '41' },
    { value: '42', label: '42' },
    { value: '42.5', label: '42.5' },
    { value: '43', label: '43' },
    { value: '44', label: '44' },
    { value: '44.5', label: '44.5' },
    { value: '45', label: '45' },
    { value: '45.5', label: '45.5' },
    { value: '46', label: '46' },
  ];

  const priceOptions: FilterDropdownOption[] = [
    { value: '', label: 'All prices' },
    { value: '<1m', label: 'Under 1 million VND' },
    { value: '1-2m', label: '1-2 million VND' },
    { value: '2-3m', label: '2-3 million VND' },
    { value: '>4m', label: 'Over 4 million VND' },
  ];

  const categoryOptions: FilterDropdownOption[] = [
    { value: 'ao-thun', label: 'T-shirt' },
    { value: 'ao-polo', label: 'Polo shirt' },
    { value: 'ao-hoodie', label: 'Hoodie' },
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearchSubmit = () => {
    handleFilterChange('title', searchTitle || undefined);
    // Auto-search will be triggered by filter change
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
        className="fixed inset-0 bg-black/35 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-100 bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-black">Filters</h3>
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

          {/* Colors */}
          <div>
            <button
              onClick={() => toggleSection('colors')}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 hover:text-gray-600"
            >
              <span>Colors</span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.colors && (
              <div className="pb-4">
                <div className="grid grid-cols-9 gap-2">
                  <button
                    className={`w-6 h-6 rounded-full bg-black border-2 ${
                      filters.colors?.includes('black') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Black"
                    onClick={() => handleMultiSelectChange('colors', 'black')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-white border-2 ${
                      filters.colors?.includes('white') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="White"
                    onClick={() => handleMultiSelectChange('colors', 'white')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-red-500 border-2 ${
                      filters.colors?.includes('red') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Red"
                    onClick={() => handleMultiSelectChange('colors', 'red')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-gray-500 border-2 ${
                      filters.colors?.includes('gray') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Gray"
                    onClick={() => handleMultiSelectChange('colors', 'gray')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-blue-600 border-2 ${
                      filters.colors?.includes('blue') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Blue"
                    onClick={() => handleMultiSelectChange('colors', 'blue')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-pink-400 border-2 ${
                      filters.colors?.includes('pink') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Pink"
                    onClick={() => handleMultiSelectChange('colors', 'pink')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-yellow-400 border-2 ${
                      filters.colors?.includes('yellow') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Yellow"
                    onClick={() => handleMultiSelectChange('colors', 'yellow')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-purple-600 border-2 ${
                      filters.colors?.includes('purple') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Purple"
                    onClick={() => handleMultiSelectChange('colors', 'purple')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-amber-800 border-2 ${
                      filters.colors?.includes('brown') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Brown"
                    onClick={() => handleMultiSelectChange('colors', 'brown')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-green-500 border-2 ${
                      filters.colors?.includes('green') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Green"
                    onClick={() => handleMultiSelectChange('colors', 'green')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-yellow-200 border-2 ${
                      filters.colors?.includes('beige') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Beige"
                    onClick={() => handleMultiSelectChange('colors', 'beige')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full bg-orange-500 border-2 ${
                      filters.colors?.includes('orange') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    title="Orange"
                    onClick={() => handleMultiSelectChange('colors', 'orange')}
                  />
                  <button
                    className={`w-6 h-6 rounded-full border-2 bg-white ${
                      filters.colors?.includes('checkered') ? 'border-black ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, black 0px, black 2px, white 2px, white 4px)',
                    }}
                    title="Checkered"
                    onClick={() => handleMultiSelectChange('colors', 'checkered')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Category */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 hover:text-gray-600"
            >
              <span>Product Category</span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.category && (
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
            )}
          </div>

          {/* Sizes */}
          <div>
            <button
              onClick={() => toggleSection('sizes')}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 hover:text-gray-600"
            >
              <span>Sizes</span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.sizes ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.sizes && (
              <div className="space-y-4">
                {/* Clothing */}
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Clothing</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {sizeOptions.map(option => (
                      <button
                        key={option.value}
                        className={`h-8 px-2 text-sm border rounded ${
                          filters.sizes?.includes(option.value)
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-black hover:border-gray-400'
                        }`}
                        onClick={() => handleMultiSelectChange('sizes', option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footwear */}
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Footwear</h4>
                  <div className="grid grid-cols-6 gap-1">
                    {shoeSizeOptions.map(option => (
                      <button
                        key={option.value}
                        className={`h-8 px-1 text-xs border rounded ${
                          filters.sizes?.includes(option.value)
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-black hover:border-gray-400'
                        }`}
                        onClick={() => handleMultiSelectChange('sizes', option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 hover:text-gray-600"
            >
              <span>Price</span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.price && (
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    </>
  );
};
