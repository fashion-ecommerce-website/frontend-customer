'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FilterProductPresenter } from '../components/FilterProductPresenter';

interface FilterProductContainerProps {
  className?: string;
}

export const FilterProductContainer: React.FC<FilterProductContainerProps> = ({
  className = ''
}) => {
  const router = useRouter();

  // Handle product click - navigate to product detail page
  const handleProductClick = useCallback((slug: string) => {
    router.push(`/products/${slug}`);
  }, [router]);

  return (
    <div className={className}>
      <FilterProductPresenter onProductClick={handleProductClick} />
    </div>
  );
};
