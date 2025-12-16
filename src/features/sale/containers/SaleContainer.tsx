'use client';

import React, { useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SalePresenter } from '../components/SalePresenter';

interface SaleContainerProps {
  className?: string;
}

function SaleContent({ className = '' }: SaleContainerProps) {
  const router = useRouter();

  const handleProductClick = useCallback(
    (detailId: number, slug: string) => {
      console.log('Sale product clicked:', { detailId, slug });
      router.push(`/products/${detailId}`);
    },
    [router]
  );

  return (
    <div className={className}>
      <SalePresenter onProductClick={handleProductClick} />
    </div>
  );
}

export const SaleContainer: React.FC<SaleContainerProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          Loading sale products...
        </div>
      }
    >
      <SaleContent {...props} />
    </Suspense>
  );
};
