"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Product, ProductCategory } from '../types/home.types';
import { ProductCard } from '@/components';
import { mockRankingProducts } from '../data/mockData';

interface ProductSectionProps {
  title: string;
  products: Product[];
  categories?: ProductCategory[];
  onProductClick: (productId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  showCategories?: boolean;
  className?: string;
  variant?: 'default' | 'newArrivals' | 'ranking';
  leftImageUrl?: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  categories,
  onProductClick,
  onCategoryClick,
  showCategories = false,
  className = '',
  variant = 'default',
  leftImageUrl
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    loop: false,
    skipSnaps: false,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section
      className={`mb-0 ${
        variant === 'newArrivals'
          ? 'w-full pt-8 sm:pt-12 lg:pt-20 flex flex-col justify-start items-start gap-4 sm:gap-6'
          : variant === 'ranking'
          ? 'w-full pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12 flex flex-col justify-start items-start gap-4 sm:gap-6'
          : ''
      } ${className}`}
    >
      {/* Section Header */}
      <div className={`${(variant === 'newArrivals' || variant === 'ranking') ? 'self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0' : 'flex items-center justify-between mb-8'}`}>
        <div className="flex flex-col justify-start items-start">
          <h2
            className={
              variant === 'newArrivals'
                ? "text-black text-3xl sm:text-4xl lg:text-5xl font-serif font-bold uppercase leading-tight tracking-wide"
                : variant === 'ranking'
                ? "text-black text-3xl sm:text-4xl lg:text-5xl font-serif font-bold uppercase leading-tight tracking-wide"
                : "text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 tracking-wide"
            }
          >
            {variant === 'newArrivals' ? 'New Arrivals' : variant === 'ranking' ? 'Ranking' : title}
          </h2>
        </div>

        {variant === 'newArrivals' && showCategories && categories && categories.length > 0 && (
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex justify-start items-start gap-3 min-w-max">
              {(() => { const hasAnyExplicitActive = categories.some((c) => c.isActive === true); return categories.map((category, index) => {
                const isActive = hasAnyExplicitActive ? !!category.isActive : index === 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryClick?.(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-300 ${
                      isActive 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                    }`}
                  >
                    <span className="text-sm font-sans font-medium uppercase tracking-wider">{category.name}</span>
                  </button>
                );
              }); })()}
            </div>
          </div>
        )}

        {variant === 'ranking' && showCategories && categories && categories.length > 0 && (
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex justify-start items-start min-w-max">
              {(() => { const hasAnyExplicitActive = categories.some((c) => c.isActive === true); return categories.map((category, index) => {
                const isActive = hasAnyExplicitActive ? !!category.isActive : index === 0;
                return (
                  <div
                    key={category.id}
                    className={index === 0 ? 'flex flex-col justify-start items-start' : 'pl-6 flex flex-col justify-center items-start'}
                  >
                    <button
                      onClick={() => onCategoryClick?.(category.id)}
                      className="flex justify-start items-start cursor-pointer transition-colors group"
                    >
                      <span className={`${isActive ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'} text-lg font-sans font-medium uppercase tracking-wider pb-1 transition-all`}>
                        {category.name}
                      </span>
                    </button>
                  </div>
                );
              }); })()}
            </div>
          </div>
        )}

        {variant === 'default' && (
          <button className="text-black hover:text-gray-600 font-sans font-medium text-sm lg:text-base uppercase tracking-widest border-b border-black hover:border-gray-600 transition-all">
            View All
          </button>
        )}
      </div>

      {/* Category Filter */}
      {(variant !== 'newArrivals' && variant !== 'ranking') && showCategories && categories && categories.length > 0 && (
        <div className={'flex flex-wrap gap-2 mb-6'}>
          {categories.map((category, index) => {
            const isActive = category.isActive || index === 0;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick?.(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="">{category.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 ? (
        variant === 'newArrivals' ? (
          <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-4 lg:gap-0 items-stretch">
            {/* Left large image */}
            <div className="w-full min-w-0 order-2 lg:order-1">
              <div className="w-full h-full relative">
                <div className="w-full aspect-square lg:h-full lg:aspect-[995/1287] overflow-hidden cursor-pointer group rounded-lg lg:rounded-none">
                  <img
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-95 group-hover:scale-105"
                    src={leftImageUrl || products[0]?.image}
                    alt={products[0]?.name || 'New arrivals'}
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="pointer-events-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-md border border-white text-white bg-white/10 hover:bg-white/15 uppercase text-xs sm:text-sm font-semibold tracking-wide transition-colors">
                        View all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right grid panel */}
            <div className="w-full min-w-0 order-1 lg:order-2 lg:pl-4 lg:pr-0 bg-white rounded-lg lg:rounded">
              <div className="w-full h-full grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 lg:gap-4">
                {products.slice(1, 5).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : variant === 'ranking' ? (
          <div className="self-stretch relative flex flex-col justify-start items-start">
            <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
              <div className="relative">
                {(products?.length ?? mockRankingProducts.length) > 5 && (
                  <div className="absolute left-0 right-0 top-[42%] -translate-y-1/2 hidden lg:flex justify-between items-center pointer-events-none z-10 px-2.5">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      className="pointer-events-auto w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-[0] transition-all duration-300 bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                      style={{
                        transform: 'translateY(-50%)',
                        WebkitTransform: 'translateY(-50%)',
                        msTransform: 'translateY(-50%)',
                        OTransform: 'translateY(-50%)'
                      }}
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={scrollNext}
                      className="pointer-events-auto w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-[0] transition-all duration-300 bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                      style={{
                        transform: 'translateY(-50%)',
                        WebkitTransform: 'translateY(-50%)',
                        msTransform: 'translateY(-50%)',
                        OTransform: 'translateY(-50%)'
                      }}
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="overflow-hidden w-full" ref={emblaRef}>
                  <div className="flex gap-2 sm:gap-3 lg:gap-3.5">
                    {(products && products.length > 0 ? products : mockRankingProducts).map((product, idx) => (
                      <div key={product.id} className="relative flex-[0_0_calc(50%-0.25rem)] sm:flex-[0_0_calc(33.33%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)] lg:flex-[0_0_calc(20%-0.7rem)] min-w-0">
                        <div className="absolute left-0 top-0 z-10 select-none">
                          <img src="https://file.hstatic.net/200000642007/file/bg_rank_c21e90ddb3c74242970a777d424a1ae5.png" alt="rank badge" className="w-6 h-8 sm:w-8 sm:h-10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm sm:text-[18px] font-semibold leading-none">{idx + 1}</span>
                          </div>
                        </div>
                        <ProductCard
                          product={product}
                          onProductClick={onProductClick}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
        </div>
      )}
    </section>
  );
};
