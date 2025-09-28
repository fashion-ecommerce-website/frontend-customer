'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  initialCategory?: string;
  // Optional title passed from a parent/header component. If provided, this will be
  // used as the page header. Otherwise we try URL param 'name' or 'title', then
  // fall back to a formatted category slug.
  title?: string;
}

export const FilterProductPresenter: React.FC<FilterProductPresenterProps> = ({
  onProductClick,
  initialCategory,
  title
}) => {
  const [products, setProducts] = useState<FilterProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory || 'ao-thun', // Default category to fix API required parameter
    page: 1,
    pageSize: 12
  });

  const searchParams = useSearchParams();

  // Format slug -> human readable title. Example: 'ao-thun' -> 'AO THUN' (capitalized)
  const formatTitleFromSlug = (slug?: string) => {
    if (!slug) return '';
    try {
      const decoded = decodeURIComponent(slug || '');
      const parts = decoded.replace(/_/g, '-').split('-').filter(Boolean);
      const title = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      return title.toUpperCase();
    } catch (e) {
      return slug.toUpperCase();
    }
  };

  const displayTitle = useMemo(() => {
    // Priority: prop title > URL param 'name' or 'title' > formatted category
    if (title && title.trim().length > 0) return title;
    const paramName = searchParams?.get('name') || searchParams?.get('title');
    if (paramName && paramName.trim().length > 0) return paramName;
    return formatTitleFromSlug(filters.category);
  }, [title, searchParams, filters.category]);

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

  // If initialCategory changes (from query param), update filters
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory, page: 1 }));
    }
  }, [initialCategory]);

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

  <div className="mb-4 text-black flex justify-center font-bold text-[32px]">{displayTitle}</div>

      {/* Header với Breadcrumb và Sort */}
      <ProductFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        title={displayTitle}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        productCount={pagination.totalItems}
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
