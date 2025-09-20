'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ProductFilter } from './ProductFilter';
import { FilterSidebar } from './FilterSidebar';
import { ProductList } from './ProductList';
import { Pagination } from './Pagination';
import { ProductFilters, FilterProductItem } from '../types';
import { productApi } from '../../../services/api/productApi';

// Debounce hook for API calls
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface FilterProductPresenterProps {
  onProductClick: (detailId: number, slug: string) => void;
}

export const FilterProductPresenter: React.FC<FilterProductPresenterProps> = ({
  onProductClick
}) => {
  const [products, setProducts] = useState<FilterProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'ao-thun', // Default category to fix API required parameter
    page: 1,
    pageSize: 12
  });

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300); // 300ms delay
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });

  const fetchProducts = async (searchFilters: ProductFilters) => {
    // Đảm bảo skeleton hiển thị tối thiểu 400ms
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const response = await productApi.getProducts(searchFilters);
      if (response.success && response.data) {
        setProducts(response.data.items);
        setPagination({
          page: response.data.page + 1, // Convert: Server page 0 → UI page 1
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        });
      } else {
        setError(response.message || 'An error occurred while loading products');
        setProducts([]);
      }
    } catch (err) {
      setError('Unable to connect to server');
      setProducts([]);
    } finally {
      const elapsed = Date.now() - start;
      const minDelay = 200;
      if (elapsed < minDelay) {
        loadingTimeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, minDelay - elapsed);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts(debouncedFilters);
  }, [debouncedFilters]); // Listen to debounced filter changes

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    const updatedFilters = {
      ...newFilters,
      category: newFilters.category || 'ao-thun', // Ensure category is always set
      page: 1 // Reset to first page when filters change
    };
    setFilters(updatedFilters);
    // Auto-fetch will be triggered by useEffect with debounce
  }, []);

  const handleSearch = () => {
    // Manual search - just trigger fetch with current filters
    fetchProducts(filters);
  };

  const handlePageChange = useCallback((page: number) => {
    const updatedFilters = {
      ...filters,
      page
    };
    setFilters(updatedFilters);
    // Auto-fetch will be triggered by useEffect with debounce
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="w-full bg-gray-50 px-16 py-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-black px-4 py-3 relative mb-6 rounded-lg">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={handleClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-black"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      <div className="mb-4 text-black flex justify-center font-bold text-[32px]">T-SHIRT</div>

      {/* Header với Breadcrumb và Sort */}
      <ProductFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Product List */}
      <ProductList
        products={products}
        isLoading={isLoading}
        onProductClick={onProductClick}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
