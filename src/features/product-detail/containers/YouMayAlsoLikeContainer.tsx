'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { recommendationApi } from '@/services/api/recommendationApi';
import { YouMayAlsoLikePresenter } from '../components/YouMayAlsoLikePresenter';

interface YouMayAlsoLikeContainerProps {
  productId: number;
}

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

export function YouMayAlsoLikeContainer({ productId }: YouMayAlsoLikeContainerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarProducts = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await recommendationApi.getSimilarItems(productId, 10);

      if (response.success && response.data) {
        const transformedProducts = response.data.map((item) => ({
          detailId: item.detailId,
          productSlug: item.productSlug,
          productTitle: item.productTitle,
          price: item.price,
          finalPrice: item.finalPrice,
          percentOff: item.percentOff,
          imageUrls: item.imageUrls,
          colors: item.colors,
          quantity: item.quantity,
        }));
        setProducts(transformedProducts);
      } else {
        throw new Error(response.message || 'Failed to fetch similar products');
      }
    } catch (err) {
      console.error('❌ Failed to fetch similar products:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchSimilarProducts();
  }, [fetchSimilarProducts]);

  const handleProductClick = useCallback((detailId: number) => {
    router.push(`/products/${detailId}`);
  }, [router]);

  return (
    <YouMayAlsoLikePresenter
      products={products}
      loading={loading}
      error={error}
      onProductClick={handleProductClick}
    />
  );
}
