'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SaleProductPresenter } from '../components/SaleProductPresenter';

interface SaleProductContainerProps {
  className?: string;
}

export const SaleProductContainer: React.FC<SaleProductContainerProps> = ({
  className = ''
}) => {
  const router = useRouter();

  const handleProductClick = useCallback((detailId: number, slug: string) => {
    console.log('Product clicked:', { detailId, slug });
    router.push(`/products/${detailId}`);
  }, [router]);

  return (
    <div className={className}>
      <SaleProductPresenter onProductClick={handleProductClick} />
    </div>
  );
};
