"use client";

import React from "react";
import { SearchResultItem } from "../types";
import { ProductList } from "../../filter-product/components/ProductList";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  onProductClick: (detailId: number, slug: string) => void;
  query?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  onProductClick,
  query,
}) => {
  const { translations } = useLanguage();
  const t = translations.search;

  // No results
  if (!isLoading && !results.length) {
    return (
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
          {t.noProductsFound}
        </h3>
        <p className="text-black">
          {query
            ? `${t.noResultsFor} "${query}"`
            : t.tryDifferentKeywords}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product List - Reuse existing ProductList component */}
      <ProductList
        products={results}
        isLoading={isLoading}
        onProductClick={onProductClick}
      />
    </div>
  );
};
