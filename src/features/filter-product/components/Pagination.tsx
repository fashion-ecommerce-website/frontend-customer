'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous button (circular with '<') */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="Previous page"
        className={`w-9 h-9 text-sm font-medium rounded-full flex items-center justify-center transition-colors ${
          hasPrevious
            ? 'text-black bg-white border border-gray-300 hover:bg-gray-50'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60'
        }`}
      >
        &lt;
      </button>

      {/* Page numbers (circular) */}
      {generatePageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          aria-label={`Go to page ${pageNum}`}
          className={`w-9 h-9 text-sm font-medium rounded-full flex items-center justify-center transition-colors ${
            pageNum === currentPage
              ? 'text-white bg-black border border-black'
              : 'text-black bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Next button (circular with '>') */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        aria-label="Next page"
        className={`w-9 h-9 text-sm font-medium rounded-full flex items-center justify-center transition-colors ${
          hasNext
            ? 'text-black bg-white border border-gray-300 hover:bg-gray-50'
            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60'
        }`}
      >
        &gt;
      </button>
    </div>
  );
};
