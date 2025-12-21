'use client';

import React from 'react';
import { ProductCarousel } from '@/components/ProductCarousel';
import { useLanguage } from '@/hooks/useLanguage';

interface Product {
  detailId: number;
  productSlug: string;
  productTitle: string;
  price: number;
  finalPrice: number;
  percentOff: number;
  imageUrls: string[];
  colors: string[];
  quantity: number;
}

interface YouMayAlsoLikePresenterProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (detailId: number) => void;
}

export function YouMayAlsoLikePresenter({ 
  products, 
  loading, 
  error,
  onProductClick 
}: YouMayAlsoLikePresenterProps) {
  const { translations } = useLanguage();
  
  if (loading) {
    return (
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            {translations.product.youMayAlsoLike}
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silent fail for recommendations
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <ProductCarousel
        products={products}
        title={translations.product.youMayAlsoLike}
        onProductClick={onProductClick}
      />
    </section>
  );
}
