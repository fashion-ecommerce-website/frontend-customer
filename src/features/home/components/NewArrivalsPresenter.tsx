'use client';

import React from 'react';
import Image from 'next/image';
import { ProductItem } from '@/services/api/productApi';
import { ProductCard } from '@/components';
import { Product } from '@/types/product.types';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useLanguage } from '@/hooks/useLanguage';

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

export function NewArrivalsPresenter(props: NewArrivalsPresenterProps) {
  const {
    products,
    categories,
    activeCategory,
    loading,
    onCategoryClick,
    onProductClick,
    onViewAll,
  } = props;
  const { translations } = useLanguage();
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollWidth - scrollLeft - clientWidth > 5);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 150);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

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

  const leftImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80";

  return (
    <section className="w-full space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="self-stretch flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200/80 pb-4">
        <div className="flex flex-col justify-start items-start space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A880]">
            NEW COLLECTION
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-neutral-900">
            {translations.home.newArrivals || 'New Arrivals'}
          </h2>
        </div>

        {/* Category Badges with Smooth Scroll Arrows and Edge Fades */}
        <div className="relative flex items-center w-full md:w-auto max-w-full md:max-w-[70%] group/scroll">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-1 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/95 border border-neutral-200/80 shadow-sm hover:scale-105 active:scale-95 transition-all text-neutral-800 cursor-pointer"
              aria-label="Scroll left"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Left Fade Overlay */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-5" />
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="w-full overflow-x-auto hide-scrollbar scroll-smooth py-1 px-2"
          >
            <div className="flex justify-start items-center gap-2 sm:gap-3 min-w-max">
              {categories.map((category) => {
                const isActive = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryClick(category.id)}
                    className={`flex-shrink-0 px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                      isActive ? 'bg-neutral-950 text-[#C5A880] border-neutral-950 shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    <span>
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Fade Overlay */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-5" />
          )}

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-1 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/95 border border-neutral-200/80 shadow-sm hover:scale-105 active:scale-95 transition-all text-neutral-800 cursor-pointer"
              aria-label="Scroll right"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-4 lg:gap-6 items-stretch">
          {/* Left large image skeleton */}
          <div className="w-full min-w-0 order-2 lg:order-1">
            <div className="w-full aspect-square lg:aspect-[995/1287] bg-neutral-200 animate-pulse rounded-xl" />
          </div>

          {/* Right grid panel skeleton */}
          <div className="w-full min-w-0 order-1 lg:order-2">
            <div className="w-full h-full grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-full aspect-[4/5] bg-neutral-200 animate-pulse rounded-xl mb-3" />
                  <div className="space-y-2 px-1">
                    <div className="h-4 bg-neutral-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : transformedProducts.length > 0 ? (
        <div className="self-stretch grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-4 lg:gap-6 items-stretch">
          {/* Left large image */}
          <div className="w-full min-w-0 order-2 lg:order-1">
            <AnimatedSection animation="fade-up" duration={0.8} delay={100}>
              <div className="w-full h-full relative">
                <div className="w-full aspect-square lg:h-full lg:aspect-[995/1287] overflow-hidden cursor-pointer group rounded-xl relative shadow-md">
                  <Image
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    src={leftImageUrl}
                    alt="New arrivals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 space-y-3">
                    <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">HAUTE COUTURE</span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal">Latest Collection</h3>
                    <div>
                      <button 
                        onClick={onViewAll}
                        className="cursor-pointer px-6 py-2.5 rounded-full border border-[#C5A880] text-[#C5A880] bg-neutral-950/60 hover:bg-[#C5A880] hover:text-neutral-950 uppercase text-xs font-semibold tracking-widest transition-all backdrop-blur-xs"
                      >
                        {translations.home.viewAll || 'View All'}
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
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      )}
    </section>
  );
}
