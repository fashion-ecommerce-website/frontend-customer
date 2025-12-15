'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchProductFilter } from './SearchProductFilter';
import { FilterSidebar } from '../../filter-product/components/FilterSidebar';
import { Pagination } from '../../filter-product/components/Pagination';
import { SearchResultItem } from '../types';
import { ProductFilters } from '../../filter-product/types';
import { productApi } from '../../../services/api/productApi';
import { addSearchHistory } from '../../../utils/searchHistory';

// Debounce hook for API calls
const useDebounce = (value: ProductFilters, delay: number): ProductFilters => {
  const [debouncedValue, setDebouncedValue] = useState<ProductFilters>(value);

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

interface SearchPresenterProps {
  onProductClick: (detailId: number, slug: string) => void;
  initialQuery?: string;
  initialCategory?: string; // Optional - if provided, filter by this category
}

export const SearchPresenter: React.FC<SearchPresenterProps> = ({
  onProductClick,
  initialQuery = "",
  initialCategory
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory, // Only set if provided (e.g., from profile)
    title: initialQuery,
    page: 1,
    pageSize: 12,
    sort: 'productTitle_asc'
  });

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  const searchProducts = async (searchFilters: ProductFilters) => {

    // Save search query to history only on first page (avoid saving during pagination)
    if (searchFilters.title?.trim() && searchFilters.page === 1) {
      addSearchHistory(searchFilters.title.trim());
    }

    // Ensure skeleton shows for minimum 400ms
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(true);
    setError(null);
    const start = Date.now();
    
    try {
      // Convert search filters to product API format - category is optional
      const apiParams = {
        title: searchFilters.title?.trim(),
        category: searchFilters.category, // Optional - searches all categories if not provided
        page: searchFilters.page || 1,
        pageSize: searchFilters.pageSize || 12,
        colors: searchFilters.colors,
        sizes: searchFilters.sizes,
        sort: searchFilters.sort,
        price: searchFilters.price
      };

      const response = await productApi.getProducts(apiParams);
      
      if (response.success && response.data) {
        setResults(response.data.items);
        setPagination({
          page: response.data.page + 1, // Convert: Server page 0 → UI page 1
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        });
      } else {
        setError(response.message || 'An error occurred while searching for products');
        setResults([]);
      }
    } catch {
      setError('Unable to connect to server');
      setResults([]);
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

  // Auto-search when debounced filters change - always fetch products
  useEffect(() => {
    searchProducts(debouncedFilters);
  }, [debouncedFilters]);

  const handleSearch = useCallback((searchQuery: string) => {
    const newQuery = searchQuery.trim();
    setQuery(newQuery);
    
    const updatedFilters: ProductFilters = {
      ...filters,
      title: newQuery,
      category: undefined, // Clear category when user searches to search across all categories
      page: 1 // Reset to first page for new search
    };
    
    setFilters(updatedFilters);
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    const updatedFilters: ProductFilters = {
      ...newFilters,
      title: query, // Preserve current search query
      page: newFilters.page || 1
    };
    setFilters(updatedFilters);
  }, [query]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-black mb-8">
            Search Products
          </h1>
          
          <SearchInput
            onSearch={handleSearch}
            onProductClick={onProductClick}
            isLoading={isLoading}
            initialQuery={initialQuery}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-black px-4 py-3 relative rounded-lg">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={handleClearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-black"
            >
              <span className="sr-only">Dismiss</span>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters - always show */}
      <div className="max-w-7xl mx-auto px-4">
        <SearchProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchQuery={query}
          resultsCount={results.length}
          isLoading={isLoading}
        />
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Results - always show */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchResults
          results={results}
          isLoading={isLoading}
          onProductClick={onProductClick}
          query={query}
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
    </div>
  );
};