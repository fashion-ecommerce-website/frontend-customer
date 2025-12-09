'use client';

import React from 'react';
import Image from 'next/image';
import { ProductItem } from '@/services/api/productApi';
import { ProductCard } from '@/components';
import { Product } from '@/types/product.types';
import { AnimatedSection } from '@/components/AnimatedSection';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NewArrivalsPresenterProps {
  products: ProductItem[];
  categories: Category[];
  activeCategory: string;
  loading: boolean;
  onCategoryClick: (categoryId: string) => void;
  onProductClick: (detailId: number) => void;
  onViewAll: () => void;
}

export function NewArrivalsPresenter({
  products,
  categories,
  activeCategory,
  loading,
  onCategoryClick,
  onProductClick,
  onViewAll,
}: NewArrivalsPresenterProps) {
  // Transform ProductItem to Product format expected by ProductCard
  const transformedProducts: Product[] = products.map((item) => ({
    id: item.detailId.toString(),
    name: item.productTitle,
    brand: '',
    price: item.price,
    finalPrice: item.finalPrice,
    percentOff: item.percentOff,
    image: item.imageUrls?.[0] || '',
    images: item.imageUrls || [],
    category: '',
    colors: item.colors || [],
    sizes: [],
    isNew: true,
  }));

  const leftImageUrl = "https://cdn.hstatic.net/files/200000642007/file/banner_phu_-_giay_dep_-675_x873_bdb081cf9da74f98a05c919d53ed843d.jpg";

  return (
    <section className="w-full pt-12 sm:pt-16 lg:pt-20 flex flex-col justify-start items-start gap-4 sm:gap-6">
      {/* Section Header */}
      <div className="self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex flex-col justify-start items-start">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            NEW ARRIVALS
          </h2>
        </div>

        {/* Category Badges */}
        <div className="w-full sm:w-auto overflow-x-auto">
          <div className="flex justify-start items-start gap-2 sm:gap-2.5 min-w-max">
            {categories.map((category) => {
              const isActive = category.id === activeCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryClick(category.id)}
                  className={`flex-shrink-0 px-3 sm:px-5 py-1 sm:py-px rounded-[34px] border border-black cursor-pointer transition-colors ${
                    isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <span className="text-center text-sm sm:text-lg font-semibold leading-loose">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-4 lg:gap-0 items-stretch">
          {/* Left large image skeleton */}
          <div className="w-full min-w-0 order-2 lg:order-1">
            <div className="w-full aspect-square lg:aspect-[995/1287] bg-gray-200 animate-pulse rounded-lg lg:rounded-none" />
          </div>

          {/* Right grid panel skeleton */}
          <div className="w-full min-w-0 order-1 lg:order-2 lg:pl-4 lg:pr-0">
            <div className="w-full h-full grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 lg:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-full aspect-[4/5] bg-gray-200 animate-pulse rounded-lg mb-2 sm:mb-3" />
                  <div className="space-y-2 px-0.5 sm:px-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="w-3 h-3 bg-gray-200 animate-pulse rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : transformedProducts.length > 0 ? (
        <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-4 lg:gap-0 items-stretch">
          {/* Left large image */}
          <div className="w-full min-w-0 order-2 lg:order-1">
            <AnimatedSection animation="fade-up" duration={0.8} delay={100}>
              <div className="w-full h-full relative">
                <div className="w-full aspect-square lg:h-full lg:aspect-[995/1287] overflow-hidden cursor-pointer group rounded-lg lg:rounded-none relative">
                  <Image
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-95 group-hover:scale-105"
                    src={leftImageUrl}
                    alt="New arrivals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={onViewAll}
                        className="pointer-events-auto cursor-pointer px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-md border border-white text-white bg-white/10 hover:bg-white/25 uppercase text-xs sm:text-sm font-semibold tracking-wide transition-colors"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right grid panel */}
          <div className="w-full min-w-0 order-1 lg:order-2 lg:pl-4 lg:pr-0 bg-white rounded-lg lg:rounded">
            <div className="w-full h-full grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 lg:gap-4">
              {transformedProducts.slice(0, 4).map((product, index) => (
                <AnimatedSection key={product.id} animation="fade-up" duration={0.6} delay={150 + index * 50}>
                  <ProductCard
                    product={product}
                    onProductClick={() => onProductClick(parseInt(product.id))}
                    className="w-full"
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-12">
          <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
        </div>
      )}
    </section>
  );
}
