'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchFilters } from '../types';
import { SearchHistory } from './SearchHistory';
import { SearchSuggestions } from './SearchSuggestions';
import { 
  getRecentSearches, 
  removeSearchHistoryItem, 
  clearSearchHistory,
  addSearchHistory
} from '../../../utils/searchHistory';
import { productApi } from '../../../services/api/productApi';
import { ProductItem } from '../../../services/api/productApi';

interface SearchInputProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onProductClick?: (detailId: number, slug: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialQuery?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onProductClick,
  isLoading = false,
  placeholder = "Search products...",
  initialQuery = ""
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getRecentSearches());
  }, []);

  // Fetch product suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsFetchingSuggestions(false);
      return;
    }

    // Loading state is already set in handleInputChange
    try {
      const response = await productApi.getProducts({
        category: 'ao-thun', // Default category
        title: searchQuery.trim(),
        page: 1,
        pageSize: 5 // Only fetch 5 suggestions
      });

      if (response.success && response.data) {
        setSuggestions(response.data.items);
        // Keep suggestions open even if empty to show "no results"
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(true); // Still show to display "no results"
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(true); // Show error state
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
    setShowHistory(false);
    setShowSuggestions(false);
    // Refresh history after a short delay to ensure localStorage is updated
    setTimeout(() => {
      setSearchHistory(getRecentSearches());
    }, 50);
  }, [query, onSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query.trim());
      setShowHistory(false);
      setShowSuggestions(false);
      // Refresh history after a short delay to ensure localStorage is updated
      setTimeout(() => {
        setSearchHistory(getRecentSearches());
      }, 50);
    }
  }, [query, onSearch]);

  const handleSelectHistoryItem = useCallback((selectedQuery: string) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery);
    setShowHistory(false);
    setShowSuggestions(false);
    // Refresh history after a short delay
    setTimeout(() => {
      setSearchHistory(getRecentSearches());
    }, 50);
  }, [onSearch]);

  const handleSelectProduct = useCallback((detailId: number, slug: string) => {
    // Save current search query to history before navigating
    if (query.trim()) {
      addSearchHistory(query.trim());
    }
    
    setShowSuggestions(false);
    setShowHistory(false);
    
    if (onProductClick) {
      onProductClick(detailId, slug);
    }
    
    // Refresh history after navigation
    setTimeout(() => {
      setSearchHistory(getRecentSearches());
    }, 50);
  }, [onProductClick, query]);

  const handleSearchCorrection = useCallback((correctedQuery: string) => {
    setQuery(correctedQuery);
    onSearch(correctedQuery);
    setShowSuggestions(false);
    setShowHistory(false);
    // Refresh history after search
    setTimeout(() => {
      setSearchHistory(getRecentSearches());
    }, 50);
  }, [onSearch]);

  const handleRemoveHistoryItem = useCallback((itemToRemove: string) => {
    removeSearchHistoryItem(itemToRemove);
    setSearchHistory(getRecentSearches());
  }, []);

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    setSearchHistory([]);
    setShowHistory(false);
  }, []);

  const handleInputFocus = () => {
    // Always refresh history when focusing to show latest searches
    const latestHistory = getRecentSearches();
    setSearchHistory(latestHistory);
    
    // Show history only if input is empty
    if (!query.trim()) {
      if (latestHistory.length > 0) {
        setShowHistory(true);
      }
      setShowSuggestions(false);
    } else {
      // If has query, fetch suggestions
      setShowHistory(false);
      fetchSuggestions(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (!newQuery.trim()) {
      // Show history when input is empty
      const latestHistory = getRecentSearches();
      setSearchHistory(latestHistory);
      if (latestHistory.length > 0) {
        setShowHistory(true);
      }
      setShowSuggestions(false);
      setSuggestions([]);
      setIsFetchingSuggestions(false);
    } else {
      // Hide history and prepare for suggestions
      setShowHistory(false);
      
      // Show loading state immediately for queries >= 2 characters
      if (newQuery.trim().length >= 2) {
        setShowSuggestions(true);
        setIsFetchingSuggestions(true);
      }
      
      // Debounce API call for suggestions
      debounceTimerRef.current = setTimeout(() => {
        if (newQuery.trim().length >= 2) {
          fetchSuggestions(newQuery);
        } else {
          setShowSuggestions(false);
          setSuggestions([]);
          setIsFetchingSuggestions(false);
        }
      }, 300);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full px-4 py-3 pl-12 pr-16 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-black text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && !showSuggestions && (
          <SearchHistory
            items={searchHistory}
            onSelectItem={handleSelectHistoryItem}
            onRemoveItem={handleRemoveHistoryItem}
            onClearAll={handleClearHistory}
          />
        )}

        {/* Product Suggestions Dropdown */}
        {showSuggestions && query.trim() && (
          <SearchSuggestions
            suggestions={suggestions}
            isLoading={isFetchingSuggestions}
            onSelectProduct={handleSelectProduct}
            onSearchCorrection={handleSearchCorrection}
            query={query}
          />
        )}
      </form>
    </div>
  );
};