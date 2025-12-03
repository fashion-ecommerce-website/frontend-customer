'use client';

import React, { useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { FilterProductPresenter } from '../components/FilterProductPresenter';
import { useSearchParams } from 'next/navigation';

interface FilterProductContainerProps {
  className?: string;
}

function FilterProductContent({ className = '' }: FilterProductContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || undefined;
  const initialTitle = searchParams?.get('name') || searchParams?.get('title') || undefined;

  // Handle product click - navigate to product detail page using detailId
  const handleProductClick = useCallback((detailId: number, slug: string) => {
    // Use detailId for navigation since backend expects Long ID
    console.log('Product clicked:', { detailId, slug });
    router.push(`/products/${detailId}`);
  }, [router]);

  return (
    <div className={className}>
      <FilterProductPresenter
        onProductClick={handleProductClick}
        initialCategory={initialCategory}
        title={initialTitle}
      />
    </div>
  );
}

export const FilterProductContainer: React.FC<FilterProductContainerProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <FilterProductContent {...props} />
    </Suspense>
  );
};
