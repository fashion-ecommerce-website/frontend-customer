"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Product, ProductCategory } from '../types/home.types';
import { ProductCard } from './ProductCard';
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
          ? 'w-full pt-20 flex flex-col justify-start items-start gap-6'
          : variant === 'ranking'
          ? 'w-full pt-20 pb-12 flex flex-col justify-start items-start gap-6'
          : ''
      } ${className}`}
    >
      {/* Section Header */}
      <div className={`${(variant === 'newArrivals' || variant === 'ranking') ? 'self-stretch inline-flex justify-between items-center' : 'flex items-center justify-between mb-6'}`}>
        <div className="inline-flex flex-col justify-start items-start">
          <h2
            className={
              variant === 'newArrivals'
                ? "justify-center text-black text-3xl font-normal uppercase leading-10 font-['SVN-Product_Sans']"
                : variant === 'ranking'
                ? "justify-center text-black text-3xl font-normal uppercase leading-10 font-['SVN-Product_Sans']"
                : "text-2xl lg:text-3xl font-bold text-gray-900"
            }
          >
            {variant === 'newArrivals' ? 'NEW ARRIVALS' : variant === 'ranking' ? 'RANKING' : title}
          </h2>
        </div>

        {variant === 'newArrivals' && showCategories && categories && categories.length > 0 && (
          <div className="inline-flex flex-col justify-start items-start">
            <div className="inline-flex justify-start items-start gap-2.5">
              {(() => { const hasAnyExplicitActive = categories.some((c) => c.isActive === true); return categories.map((category, index) => {
                const isActive = hasAnyExplicitActive ? !!category.isActive : index === 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryClick?.(category.id)}
                    className={`self-stretch px-5 py-px rounded-[34px] outline outline-1 outline-offset-[-1px] cursor-pointer ${
                      isActive ? 'bg-black text-white outline-black' : 'bg-white text-black outline-black'
                    }`}
                  >
                    <span className="text-center justify-center text-lg font-normal leading-loose font-['SVN-Product_Sans']">{category.name}</span>
                  </button>
                );
              }); })()}
            </div>
          </div>
        )}

        {variant === 'ranking' && showCategories && categories && categories.length > 0 && (
          <div className="inline-flex flex-col justify-start items-start">
            <div className="inline-flex justify-start items-start">
              {(() => { const hasAnyExplicitActive = categories.some((c) => c.isActive === true); return categories.map((category, index) => {
                const isActive = hasAnyExplicitActive ? !!category.isActive : index === 0;
                return (
                  <div
                    key={category.id}
                    className={index === 0 ? 'self-stretch inline-flex flex-col justify-start items-start' : 'self-stretch pl-5 inline-flex flex-col justify-center items-start'}
                  >
                    {index === 0 ? (
                      <button
                        onClick={() => onCategoryClick?.(category.id)}
                        className="inline-flex justify-start items-start cursor-pointer"
                      >
                        <span className={`${isActive ? 'text-orange-400' : 'text-black'} text-lg font-normal leading-loose font-['SVN-Product_Sans']`}>
                          {category.name}
                        </span>
                      </button>
                    ) : (
                      <div className="h-8 flex flex-col justify-start items-start">
                        <button
                          onClick={() => onCategoryClick?.(category.id)}
                          className="inline-flex justify-start items-start cursor-pointer"
                        >
                          <span className={`${isActive ? 'text-orange-400' : 'text-black'} text-lg font-normal leading-loose font-['SVN-Product_Sans']`}>
                            {category.name}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }); })()}
            </div>
          </div>
        )}

        {variant === 'default' && (
          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm lg:text-base transition-colors">
            Xem tất cả →
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
          <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-0 items-stretch">
            {/* Left large image */}
            <div className="w-full min-w-0">
              <div className="w-full relative">
                <div className="w-full aspect-[995/1287] bg-gray-100 overflow-hidden cursor-pointer group">
                  <img
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                    src={leftImageUrl || products[0]?.image}
                    alt={products[0]?.name || 'New arrivals'}
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="pointer-events-auto px-8 py-3 rounded-md border border-white text-white bg-white/10 hover:bg-white/15 uppercase text-sm font-semibold tracking-wide transition-colors">
                        View all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right grid panel */}
            <div className="w-full min-w-0 h-full p-6 pr-[9px] lg:p-8 lg:pr-[17px] bg-zinc-100 rounded">
              <div className="grid grid-cols-2 gap-0">
                {products.slice(1, 5).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    className="w-full pr-[15px] pb-[15px]"
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
                  <div className="absolute left-0 right-0 top-[42%] -translate-y-1/2 hidden sm:flex justify-between items-center pointer-events-none z-10 px-2.5">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full text-[0] transition-all duration-300 bg-black/40 hover:bg-black/60"
                      style={{
                        transform: 'translateY(-50%)',
                        WebkitTransform: 'translateY(-50%)',
                        msTransform: 'translateY(-50%)',
                        OTransform: 'translateY(-50%)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 46" fill="none">
                        <path d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683" stroke="white" strokeWidth="2" strokeLinecap="square"></path>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={scrollNext}
                      className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full text-[0] transition-all duration-300 bg-black/40 hover:bg-black/60"
                      style={{
                        transform: 'translateY(-50%)',
                        WebkitTransform: 'translateY(-50%)',
                        msTransform: 'translateY(-50%)',
                        OTransform: 'translateY(-50%)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 46" fill="none">
                        <path d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332" stroke="white" strokeWidth="2" strokeLinecap="square"></path>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="overflow-hidden w-full" ref={emblaRef}>
                  <div className="flex gap-3.5">
                    {(products && products.length > 0 ? products : mockRankingProducts).map((product, idx) => (
                      <div key={product.id} className="relative flex-[0_0_calc((100%-0.875rem)/2)] md:flex-[0_0_calc((100%-3.5rem)/5)] min-w-0">
                        <div className="absolute left-0 top-0 z-10 select-none">
                          <img src="https://file.hstatic.net/200000642007/file/bg_rank_c21e90ddb3c74242970a777d424a1ae5.png" alt="rank badge" className="w-8 h-10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-[18px] font-semibold leading-none">{idx + 1}</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
