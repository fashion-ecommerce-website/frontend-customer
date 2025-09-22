'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { recentlyViewedApiService } from '@/services/api/recentlyViewedApi';

interface RecentlyViewedItem {
  detailId: number;
  price: number;
  originalPrice?: number; // For discount calculation
  quantity: number;
  colors: string[];
  imageUrls: string[];
  colorName: string;
  productTitle: string;
  productSlug: string;
}

export function ProductDetailRecentlyViewed() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const displayItems = useMemo(() => {
    if (items.length === 0) return []
    // Create multiple copies for smooth infinite loop
    else if (items.length > 5) return [...items, ...items];
    return [...items];
  }, [items]);
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      startIndex: items.length,
    }
    
  );

  useEffect(() => {
    if (emblaApi && displayItems.length > 0 && items.length > 0) {
      emblaApi.scrollTo(items.length, false);
    }
  }, [emblaApi, displayItems.length, items.length]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const handleProductClick = useCallback((detailId: number, slug: string) => {
    router.push(`/products/${detailId}`);
  }, [router]);

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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
        <div className="mx-auto px-12 max-w-none">
          <div className="mb-6 md:mb-8">
            <h2 className="text-[20px] leading-7 font-bold text-gray-900 border-b-[3px] border-black pb-2">
              Recently Viewed
            </h2>
          </div>
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
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="mx-auto px-12 max-w-none">
        {/* Header */}
        <div className="mb-6 md:mb-8 relative">
          <h2 className="text-[20px] leading-7 font-bold text-gray-900 border-b-[3px] border-black pb-2">
            Recently Viewed
          </h2>
        </div>

        {/* Embla Carousel with Navigation */}

        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile, positioned in center */}
          {items.length > 5 && (
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
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayItems.map((item, index) => {
                const firstImage = item.imageUrls?.[0] ?? '';
                const secondImage = item.imageUrls?.[1] ?? null;

                return (
                  <div
                    key={`${item.detailId}-${index}`}
                    className="flex-[0_0_calc(20%-1.2rem)] sm:flex-[0_0_calc(33.333%-1rem)] lg:flex-[0_0_calc(20%-1.2rem)] min-w-0 group cursor-pointer"
                    onClick={() => handleProductClick(item.detailId, item.productSlug)}
                  >
                    {/* Product Image */}
                    <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                      {firstImage ? (
                        <>
                          {/* Base image */}
                          <div
                            className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-300"
                            style={{ backgroundImage: `url(${firstImage})` }}
                          />

                          {/* Hover image */}
                          {secondImage && (
                            <div
                              className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100"
                              style={{ backgroundImage: `url(${secondImage})` }}
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold h-12 text-black text-[14px] sm:text-[16px] line-clamp-2 leading-tight">
                        {item.productTitle}
                      </h3>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-black">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Available colors */}
                      <div className="flex items-center gap-1">
                        {item.colors.map((color, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-transform hover:scale-110 ${color === 'black' ? 'bg-black' :
                              color === 'white' ? 'bg-white border border-gray-500' :
                                color === 'red' ? 'bg-red-500' :
                                  color === 'blue' || color === 'dark blue' ? 'bg-blue-500' :
                                    color === 'mint' ? 'bg-green-300' :
                                      color === 'brown' ? 'bg-amber-700' :
                                        color === 'yellow' ? 'bg-yellow-400' :
                                          color === 'pink' ? 'bg-pink-400' :
                                            color === 'olive' ? 'bg-green-600' :
                                              color === 'cream' ? 'bg-yellow-100' :
                                                color === 'light blue' ? 'bg-blue-200' :
                                                  color === 'gray' ? 'bg-gray-400' :
                                                    'bg-gray-400'
                              }`}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}