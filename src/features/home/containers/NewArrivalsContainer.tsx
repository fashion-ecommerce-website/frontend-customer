'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, ProductCardWithPromotion, NewArrivalsCategory } from '@/services/api/productApi';
import { categoryApi, Category } from '@/services/api/categoryApi';
import { NewArrivalsPresenter } from '../components/NewArrivalsPresenter';

export function NewArrivalsContainer() {
  const router = useRouter();
  const [categories, setCategories] = useState<NewArrivalsCategory[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch category tree for getting child categories
  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        const response = await categoryApi.getTree();
        if (response.success && response.data) {
          setCategoryTree(response.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch category tree:', error);
      }
    };
    fetchCategoryTree();
  }, []);

  // Fetch new arrivals from API
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await productApi.getNewArrivals(undefined, 4);

        if (response.success && response.data && response.data.length > 0) {
          setCategories(response.data);
          // Set first category as active by default
          if (response.data[0].categorySlug) {
            setActiveCategory(response.data[0].categorySlug);
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch new arrivals:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Get current active category's products
  const activeProducts = categories.find(c => c.categorySlug === activeCategory)?.products || [];

  // Transform categories for presenter
  const categoryOptions = categories.map(c => ({
    id: c.categorySlug,
    name: c.categoryName,
    slug: c.categorySlug,
  }));

  // Transform products to match presenter's expected format
  const transformedProducts = activeProducts.map((item: ProductCardWithPromotion) => ({
    detailId: item.detailId,
    productSlug: item.productSlug,
    productTitle: item.productTitle,
    price: item.price,
    finalPrice: item.finalPrice,
    percentOff: item.percentOff,
    imageUrls: item.imageUrls,
    colors: item.colors,
    quantity: item.quantity,
    colorName: item.colorName,
    sizeName: '',
  }));

  const handleCategoryClick = useCallback((categorySlug: string) => {
    setActiveCategory(categorySlug);
  }, []);

  const handleProductClick = useCallback((detailId: number) => {
    router.push(`/products/${detailId}`);
  }, [router]);

  const handleViewAll = useCallback(() => {
    // Find the first child category of the active root category
    const rootCategory = categoryTree.find(c => c.slug === activeCategory);
    if (rootCategory?.children && rootCategory.children.length > 0) {
      // Navigate to products page with first child category
      const firstChildSlug = rootCategory.children[0].slug;
      router.push(`/products?category=${firstChildSlug}`);
    } else {
      // Fallback to products page without filter
      router.push('/products');
    }
  }, [router, activeCategory, categoryTree]);

  return (
    <NewArrivalsPresenter
      products={transformedProducts}
      categories={categoryOptions}
      activeCategory={activeCategory}
      loading={loading}
      onCategoryClick={handleCategoryClick}
      onProductClick={handleProductClick}
      onViewAll={handleViewAll}
    />
  );
}
