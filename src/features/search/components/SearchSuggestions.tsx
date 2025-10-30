'use client';

import React from 'react';
import Image from 'next/image';
import { findSuggestion, POPULAR_KEYWORDS } from '../../../utils/searchCorrection';

interface ProductSuggestion {
  detailId: number;
  productTitle: string;
  productSlug: string;
  price: number;
  finalPrice: number;
  percentOff?: number;
  imageUrls: string[];
  colorName: string;
}

interface SearchSuggestionsProps {
  suggestions: ProductSuggestion[];
  isLoading: boolean;
  onSelectProduct: (detailId: number, slug: string) => void;
  onSearchCorrection?: (keyword: string) => void;
  query: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  isLoading,
  onSelectProduct,
  onSearchCorrection,
  query
}) => {
  // Find suggestion for typo correction
  const suggestedKeyword = findSuggestion(query);
  
  // Always show the dropdown container for smooth UX (no flickering)
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {isLoading ? (
        // Loading skeleton
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : suggestions.length === 0 ? (
        // No results state
        <div className="p-6 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-500 mb-3">
            No products found for &quot;{query}&quot;
          </p>
          
          {/* Did you mean suggestion */}
          {suggestedKeyword && suggestedKeyword.toLowerCase() !== query.toLowerCase() && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Did you mean:</p>
              <button
                onClick={() => onSearchCorrection?.(suggestedKeyword)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {suggestedKeyword}
              </button>
            </div>
          )}
          
          {/* Popular searches */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_KEYWORDS.slice(0, 6).map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => onSearchCorrection?.(keyword)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Results
        <>
          <div className="px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Products matching &quot;{query}&quot;
            </span>
          </div>
          
          <ul className="py-2">
            {suggestions.map((product) => (
              <li
                key={product.detailId}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <button
                  onClick={() => onSelectProduct(product.detailId, product.productSlug)}
                  className="w-full px-4 py-3 flex gap-3 items-center text-left"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    {product.imageUrls[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.productTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.productTitle}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Color: {product.colorName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-black">
                        {product.finalPrice.toLocaleString('vi-VN')}₫
                      </span>
                      {product.percentOff && product.percentOff > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                          <span className="text-xs font-medium text-red-600">
                            -{product.percentOff}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Press Enter to see all results
            </p>
          </div>
        </>
      )}
    </div>
  );
};
