'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchPresenter } from '../components/SearchPresenter';

interface SearchContainerProps {
  className?: string;
  initialQuery?: string;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  className = '',
  initialQuery = ""
}) => {
  const router = useRouter();

  // Handle product click - navigate to product detail page using detailId
  const handleProductClick = useCallback((detailId: number, slug: string) => {
    // Use detailId for navigation since backend expects Long ID
    console.log('Product clicked from search:', { detailId, slug });
    router.push(`/products/${detailId}`);
  }, [router]);

  return (
    <div className={className}>
      <SearchPresenter 
        onProductClick={handleProductClick} 
        initialQuery={initialQuery}
      />
    </div>
  );
};