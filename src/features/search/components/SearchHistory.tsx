'use client';

import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

interface SearchHistoryProps {
  items: string[];
  onSelectItem: (query: string) => void;
  onRemoveItem: (query: string) => void;
  onClearAll: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  items,
  onSelectItem,
  onRemoveItem,
  onClearAll
}) => {
  const { translations } = useLanguage();
  const t = translations.search;

  if (items.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{t.recentSearches}</span>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-black transition-colors"
        >
          {t.clearAll}
        </button>
      </div>
      
      <ul className="py-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group"
          >
            <button
              onClick={() => onSelectItem(item)}
              className="flex items-center flex-1 text-left"
            >
              <svg
                className="w-4 h-4 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-700 group-hover:text-black">
                {item}
              </span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
              aria-label="Remove"
            >
              <svg
                className="w-4 h-4 text-gray-500 hover:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
