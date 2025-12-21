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
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
  const abortControllerRef = useRef<AbortController | null>(null);
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
    } catch {
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
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear previous timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    const start = Date.now();
    
    try {
      const response = await productApi.getProducts(searchFilters);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
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
        if (process.env.NODE_ENV === 'development') {
          console.error('Products API error:', response.message);
        }

        // Do not set or render any error message in the UI. Reset product list and pagination.
        setProducts([]);
        setPagination({
          page: 1,
          pageSize: searchFilters.pageSize || 12,
          totalItems: 0,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        return;
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('Products fetch error:', err);
      }
      setProducts([]);
      setPagination({
        page: 1,
        pageSize: searchFilters.pageSize || 12,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      });
    } finally {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      const elapsed = Date.now() - start;
      const minDelay = 200;
      if (elapsed < minDelay) {
        loadingTimeoutRef.current = setTimeout(() => {
          setIsLoading(false);
          loadingTimeoutRef.current = null;
        }, minDelay - elapsed);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts(debouncedFilters);
    
    // Cleanup on unmount or when filters change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
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
      category: newFilters.category || filters.category, // Keep current category if not provided
      page: 1 // Reset to first page when filters change
    };
    setFilters(updatedFilters);
    // Auto-fetch will be triggered by useEffect with debounce
  }, [filters.category]);

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

  // No UI error banner — errors are handled silently and logged in development.

  return (
    <div className="w-full bg-white px-3 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10">
      {/* Note: UI error banner removed — errors are logged in dev only. */}

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
