'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCarousel } from '@/components/ProductCarousel';
import { recommendationApi } from '@/services/api/recommendationApi';

interface RelatedProductsProps {
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

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const response = await recommendationApi.getSimilarItems(productId, 10);

        if (response.success && response.data) {
          // Transform to match ProductCarousel expected format
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
        }
      } catch (error) {
        console.error('❌ Failed to fetch similar products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  const handleProductClick = (detailId: number) => {
    router.push(`/products/${detailId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            You may also like
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <ProductCarousel
        products={products}
        title="You may also like"
        onProductClick={handleProductClick}
      />
    </div>
  );
}
