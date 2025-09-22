'use client';

import React, { useState, useCallback } from 'react';
import { SearchFilters } from '../types';

interface SearchInputProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialQuery?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "Search products...",
  initialQuery = ""
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  }, [query, onSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-black text-white rounded-md"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};