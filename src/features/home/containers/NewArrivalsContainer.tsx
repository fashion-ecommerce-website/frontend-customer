'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, ProductItem } from '@/services/api/productApi';
import { NewArrivalsPresenter } from '../components/NewArrivalsPresenter';

// Category mapping for API calls
const CATEGORY_MAP: Record<string, string> = {
  'shirt': 'ao-thun',
  'pant': 'quan-jogger', 
  'bag': 'tui-deo-cheo',
};

const CATEGORIES = [
  { id: 'bag', name: 'Bag', slug: 'tui-deo-cheo' },
  { id: 'shirt', name: 'Shirt', slug: 'ao-thun' },
  { id: 'pant', name: 'Pant', slug: 'quan-jogger' },
];

export function NewArrivalsContainer() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('bag');

  const fetchProducts = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      const categorySlug = CATEGORY_MAP[categoryId] || 'ao-thun';
      
      const response = await productApi.getProducts({
        category: categorySlug,
        page: 1,
        pageSize: 5, // 1 large image + 4 products
      });

      if (response.success && response.data?.items) {
        setProducts(response.data.items);
      }
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
    const categorySlug = CATEGORY_MAP[activeCategory] || 'ao-thun';
    router.push(`/products?category=${categorySlug}`);
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
