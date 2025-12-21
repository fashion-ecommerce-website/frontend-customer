'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCarousel } from '@/components/ProductCarousel';
import { productApi, ProductCardWithPromotion } from '@/services/api/productApi';

export function RankingSection() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductCardWithPromotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await productApi.getBestSellers();

        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch best sellers:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleProductClick = (detailId: number) => {
    router.push(`/products/${detailId}`);
  };

  // Transform to format expected by ProductCarousel
  const transformedProducts = products.map((item) => ({
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

  if (loading) {
    return (
      <div className="py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          RANKING
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!transformedProducts || transformedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        RANKING
      </h2>
      <ProductCarousel
        products={transformedProducts}
        title=""
        onProductClick={handleProductClick}
      />
    </div>
  );
}
