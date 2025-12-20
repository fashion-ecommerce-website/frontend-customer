'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductItem, NewArrivalProduct, NewArrivalsCategory } from '@/services/api/productApi';
import { apiClient } from '@/services/api/baseApi';
import { NewArrivalsPresenter } from '../components/NewArrivalsPresenter';

// Categories for New Arrivals (use API categories 'ao' and 'quan')
const CATEGORY_MAP: Record<string, string> = {
  all: 'all',
  ao: 'ao',
  quan: 'quan',
};

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', slug: 'all' },
  { id: 'ao', name: 'Áo', slug: 'ao' },
  { id: 'quan', name: 'Quần', slug: 'quan' },
];

export function NewArrivalsContainer() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProducts = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      // Build list of categories to fetch. If 'all', fetch both 'ao' and 'quan'.
      const targets = categoryId === 'all' ? ['ao', 'quan'] : [CATEGORY_MAP[categoryId] || 'ao'];

      // Helper to normalize API product shape to ProductItem
      const mapToProductItem = (p: NewArrivalProduct): ProductItem => ({
        quantity: (typeof p.quantity === 'number' ? p.quantity : 0),
        price: (typeof p.price === 'number' ? p.price : (typeof p.finalPrice === 'number' ? p.finalPrice : 0)),
        finalPrice: (typeof p.finalPrice === 'number' ? p.finalPrice : (typeof p.price === 'number' ? p.price : 0)),
        percentOff: typeof p.percentOff === 'number' ? p.percentOff : 0,
        promotionId: typeof p.promotionId === 'number' ? p.promotionId : undefined,
        promotionName: typeof p.promotionName === 'string' ? p.promotionName : undefined,
        colors: Array.isArray(p.colors) ? (p.colors as string[]) : [],
        productTitle: typeof p.productTitle === 'string' ? p.productTitle : '',
        productSlug: typeof p.productSlug === 'string' ? p.productSlug : '',
        colorName: typeof p.colorName === 'string' ? p.colorName : '',
        sizeName: '',
        detailId: typeof p.detailId === 'number' ? p.detailId : 0,
        imageUrls: Array.isArray(p.imageUrls) ? (p.imageUrls as string[]) : [],
      });

      const results: ProductItem[] = [];

      await Promise.all(targets.map(async (cat) => {
        try {
          const endpoint = `/products/new-arrivals?limit=4&category=${encodeURIComponent(cat)}`;
          const resp = await apiClient.get<NewArrivalsCategory[] | { products: NewArrivalProduct[] }>(endpoint, undefined, true);
          if (resp.success && resp.data) {
            const data = resp.data as NewArrivalsCategory[] | { products: NewArrivalProduct[] };
            // Response might be array of category objects or an object containing 'products'
            if (Array.isArray(data)) {
              data.forEach((catObj: NewArrivalsCategory) => {
                if (Array.isArray(catObj.products)) {
                  catObj.products.forEach((p: NewArrivalProduct) => results.push(mapToProductItem(p)));
                }
              });
            } else if (Array.isArray((data as { products: NewArrivalProduct[] }).products)) {
              (data as { products: NewArrivalProduct[] }).products.forEach((p: NewArrivalProduct) => results.push(mapToProductItem(p)));
            }
          }
        } catch (e) {
          console.error('Failed to fetch new-arrivals for', cat, e);
        }
      }));

      setProducts(results);
    } catch (error) {
      console.error('❌ Failed to fetch new arrivals:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory, fetchProducts]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleProductClick = useCallback((detailId: number) => {
    router.push(`/products/${detailId}`);
  }, [router]);

  const handleViewAll = useCallback(() => {
    if (activeCategory === 'all') {
      router.push('/products');
    } else {
      const categorySlug = CATEGORY_MAP[activeCategory] || 'ao';
      router.push(`/products?category=${categorySlug}`);
    }
  }, [router, activeCategory]);

  return (
    <NewArrivalsPresenter
      products={products}
      categories={CATEGORIES}
      activeCategory={activeCategory}
      loading={loading}
      onCategoryClick={handleCategoryClick}
      onProductClick={handleProductClick}
      onViewAll={handleViewAll}
    />
  );
}
