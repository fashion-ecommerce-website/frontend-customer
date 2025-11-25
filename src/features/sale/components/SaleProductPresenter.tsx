'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ProductFilter } from '../../filter-product/components/ProductFilter';
import { FilterSidebar } from '../../filter-product/components/FilterSidebar';
import { ProductList } from '../../filter-product/components/ProductList';
import { Pagination } from '../../filter-product/components/Pagination';
import { SaleFilters, SaleProductItem } from '../types';
import { productApi } from '../../../services/api/productApi';

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

interface SaleProductPresenterProps {
  onProductClick: (detailId: number, slug: string) => void;
}

export const SaleProductPresenter: React.FC<SaleProductPresenterProps> = ({
  onProductClick
}) => {
  const [products, setProducts] = useState<SaleProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<SaleFilters>({
    page: 1,
    pageSize: 12
  });

  const debouncedFilters = useDebounce(filters, 300);
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });

  const fetchProducts = async (searchFilters: SaleFilters) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    const start = Date.now();
    
    try {
      const response = await productApi.getDiscountedProducts(searchFilters);
      
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      if (response.success && response.data) {
        setProducts(response.data.items);
        setPagination({
          page: response.data.page + 1,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        });
      } else {
        setError(response.message || 'Đã xảy ra lỗi khi tải sản phẩm');
        setProducts([]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        return;
      }
      setError('Không thể kết nối đến máy chủ');
      setProducts([]);
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

  const handleFiltersChange = useCallback((newFilters: any) => {
    // Extract only the fields we need for sale (no category)
    const { category, ...saleFilters } = newFilters;
    const updatedFilters = {
      ...saleFilters,
      page: 1
    };
    setFilters(updatedFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    const updatedFilters = {
      ...filters,
      page
    };
    setFilters(updatedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="w-full bg-white px-3 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10 min-h-[calc(100vh-200px)]">
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

      <ProductFilter
        filters={{ ...filters, category: 'sale' }}
        onFiltersChange={handleFiltersChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        title="SALE"
      />

      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={{ ...filters, category: 'sale' }}
        onFiltersChange={handleFiltersChange}
        productCount={pagination.totalItems}
      />

      <ProductList
        products={products}
        isLoading={isLoading}
        onProductClick={onProductClick}
      />

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
