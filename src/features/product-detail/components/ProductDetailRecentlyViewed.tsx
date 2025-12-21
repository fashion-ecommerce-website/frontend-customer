'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCarousel } from '@/components/ProductCarousel';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { recentlyViewedApiService } from '@/services/api/recentlyViewedApi';
import { useLanguage } from '@/hooks/useLanguage';

interface RecentlyViewedItem {
  detailId: number;
  price: number;
  originalPrice?: number;
  quantity: number;
  colors: string[];
  imageUrls: string[];
  colorName: string;
  productTitle: string;
  productSlug: string;
}

export function ProductDetailRecentlyViewed() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { translations } = useLanguage();
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleProductClick = (detailId: number) => {
    router.push(`/products/${detailId}`);
  };

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await recentlyViewedApiService.getRecentlyViewed();

          if (response.success && response.data) {
            const transformedItems = response.data.map(item => ({
              ...item,
              originalPrice: Math.round(item.price * 1.3)
            }));
            setItems(transformedItems);
          } else {
            throw new Error(response.message || 'Error fetching recently viewed');
          }
        } catch (error) {
          console.error('❌ Failed to fetch recently viewed:', error);
          setItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setItems([]);
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            {translations.product.recentlyViewed}
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <ProductCarousel
        products={items}
        title={translations.product.recentlyViewed}
        onProductClick={handleProductClick}
      />
    </section>
  );
}