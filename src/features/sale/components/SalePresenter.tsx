'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ProductFilter } from '../../filter-product/components/ProductFilter';
import { FilterSidebar } from '../../filter-product/components/FilterSidebar';
import { ProductList } from '../../filter-product/components/ProductList';
import { Pagination } from '../../filter-product/components/Pagination';
import { ProductFilters, FilterProductItem } from '../../filter-product/types';
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

interface SalePresenterProps {
  onProductClick: (detailId: number, slug: string) => void;
}

export const SalePresenter: React.FC<SalePresenterProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<FilterProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 12,
  });

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
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
    setError(null);
    const start = Date.now();

    try {
      // Use getDiscountedProducts API for sale products
      const response = await productApi.getDiscountedProducts({
        page: searchFilters.page,
        pageSize: searchFilters.pageSize,
        colors: searchFilters.colors,
        sizes: searchFilters.sizes,
        sort: searchFilters.sort,
        price: searchFilters.price,
        title: searchFilters.title,
      });

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
          hasPrevious: response.data.hasPrevious,
        });
      } else {
        setError(response.message || 'An error occurred while loading sale products');
        setProducts([]);
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (
        (err as Error).name === 'AbortError' ||
        abortControllerRef.current?.signal.aborted
      ) {
        return;
      }
      setError('Unable to connect to server');
      setProducts([]);
    } finally {
      // Don't update loading state if request was aborted
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
  }, [debouncedFilters]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    const updatedFilters = {
      ...newFilters,
      page: 1, // Reset to first page when filters change
    };
    setFilters(updatedFilters);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const updatedFilters = {
        ...filters,
        page,
      };
      setFilters(updatedFilters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [filters]
  );

  const handleClearError = () => {
    setError(null);
  };


  return (
    <div className="w-full bg-white px-3 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10">
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

      {/* Header với Sort */}
      <ProductFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        title="SALE"
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        productCount={pagination.totalItems}
      />

      {/* Empty State */}
      {!isLoading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Hiện tại chưa có sản phẩm giảm giá</p>
          <p className="text-gray-400 text-sm mt-2">
            Hãy quay lại sau để xem các ưu đãi mới nhất!
          </p>
        </div>
      )}

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
