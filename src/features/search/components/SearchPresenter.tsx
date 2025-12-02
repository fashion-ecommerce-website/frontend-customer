'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchProductFilter } from './SearchProductFilter';
import { FilterSidebar } from '../../filter-product/components/FilterSidebar';
import { SearchFilters, SearchResultItem } from '../types';
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
}

export const SearchPresenter: React.FC<SearchPresenterProps> = ({
  onProductClick,
  initialQuery = ""
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'ao-thun', // Default category required by API
    title: initialQuery,
    page: 1,
    pageSize: 12
  });

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  const searchProducts = async (searchFilters: ProductFilters) => {
    // Only search if there's a query or specific filters
    if (!searchFilters.title?.trim() && !searchFilters.category && !searchFilters.sort && !searchFilters.price) {
      setResults([]);
      setHasSearched(false);
      return;
    }

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
    setHasSearched(true);
    const start = Date.now();
    
    try {
      // Convert search filters to product API format - category is already required
      const apiParams = {
        title: searchFilters.title?.trim(),
        category: searchFilters.category, // Already required in ProductFilters
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

  // Auto-search when debounced filters change
  useEffect(() => {
    if (debouncedFilters.title?.trim() || debouncedFilters.category || debouncedFilters.sort || debouncedFilters.price) {
      searchProducts(debouncedFilters);
    }
  }, [debouncedFilters]);

  const handleSearch = useCallback((searchQuery: string) => {
    const newQuery = searchQuery.trim();
    setQuery(newQuery);
    
    const updatedFilters: ProductFilters = {
      ...filters,
      title: newQuery,
      category: filters.category, // Keep existing category
      page: 1 // Reset to first page for new search
    };
    
    setFilters(updatedFilters);
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    const updatedFilters: ProductFilters = {
      ...newFilters,
      title: query, // Preserve current search query
      category: newFilters.category, // Category is required
      page: newFilters.page || 1
    };
    setFilters(updatedFilters);
  }, [query]);

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

      {/* Filters */}
      {(hasSearched || query.trim()) && (
        <>
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
        </>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {hasSearched || query.trim() ? (
          <SearchResults
            results={results}
            isLoading={isLoading}
            onProductClick={onProductClick}
            query={query}
          />
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-black mb-2">
              Search for your favorite products
            </h3>
            <p className="text-black">
              Enter keywords to search for products you want
            </p>
          </div>
        )}
      </div>
    </div>
  );
};