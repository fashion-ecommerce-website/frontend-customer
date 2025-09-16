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

  // Handle product click - navigate to product detail page using detailId
  const handleProductClick = useCallback((detailId: number, slug: string) => {
    // Use detailId for navigation since backend expects Long ID
    console.log('Product clicked:', { detailId, slug });
    router.push(`/products/${detailId}`);
  }, [router]);

  return (
    <div className={className}>
      <FilterProductPresenter onProductClick={handleProductClick} />
    </div>
  );
};
