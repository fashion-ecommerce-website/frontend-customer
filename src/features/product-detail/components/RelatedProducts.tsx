'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { FilterProductItem } from '@/features/filter-product';

interface RelatedProductsProps {
  category: string;
}

export function RelatedProducts({ category }: RelatedProductsProps) {
  const router = useRouter();

  // Mock data similar to recently viewed
  const getMockRelatedProducts = (): FilterProductItem[] => [
    {
      detailId: 101,
      price: 1250000,
      quantity: 15,
      colors: ["white", "black"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg",
        "https://product.hstatic.net/200000642007/product/50whs_3atsb1843_3_3645df7dc2e64185879d0f0bce0c41d2_51289e8a86bf4279accd344c3c8c35a7_master.jpg"
      ],
      colorName: "white",
      productTitle: "MLB - Unisex Round Neck Short Sleeve Baseball Logo T-Shirt",
      productSlug: "mlb-unisex-round-neck-short-sleeve-baseball-logo"
    },
    {
      detailId: 102,
      price: 1450000,
      quantity: 8,
      colors: ["navy", "gray", "black"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/07nys_3atsb1843_1_9e4bed9bb86f4f44b9bf6b3dbcf54fda_master.jpg",
        "https://product.hstatic.net/200000642007/product/07nys_3atsb1843_2_08cb8bb2a61e46cd9e6d5028223e07af_master.jpg"
      ],
      colorName: "navy",
      productTitle: "MLB - Unisex Essential Basic Crew Neck T-Shirt",
      productSlug: "mlb-unisex-essential-basic-crew-neck"
    },
    {
      detailId: 103,
      price: 1650000,
      quantity: 12,
      colors: ["pink", "white", "mint"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/50bks_3atsb1843_2_882287d03667488e9b954278fc4ebdf9_8ac60b71eebc4970930d8f43916438c2_master.jpg",
        "https://product.hstatic.net/200000642007/product/50bks_3atsb1843_3_18563f0fd8334d2b8d417fb61aeea4b3_ac092530fe0449d3b9e5c4a221636d50_master.jpg"
      ],
      colorName: "pink",
      productTitle: "MLB - Women's Cropped Fit Graphic Logo T-Shirt",
      productSlug: "mlb-womens-cropped-fit-graphic-logo"
    },
    {
      detailId: 104,
      price: 1850000,
      quantity: 6,
      colors: ["brown", "olive", "cream"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/50bks_3atse0334_1_7477d62e24054123958d170e1e919931_d7dabff799aa449393fb5d2ef48b05d8_master.jpg",
        "https://product.hstatic.net/200000642007/product/50bks_3atse0334_2_35293ae8a6634b89a4162f7066b6b42c_ed2c5f39eeb04da69d4e5a6a24a8d0b7_master.jpg"
      ],
      colorName: "brown",
      productTitle: "MLB - Unisex Vintage Style Heritage Logo T-Shirt",
      productSlug: "mlb-unisex-vintage-style-heritage-logo"
    },
    {
      detailId: 105,
      price: 2150000,
      quantity: 10,
      colors: ["red", "blue", "yellow"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/07whs_3atsb1843_1_2380b55b265a4723a52de7c293d9a8a1_master.jpg",
        "https://product.hstatic.net/200000642007/product/07whs_3atsb1843_2_4b3f46d4db0d451085c38544374c9972_master.jpg"
      ],
      colorName: "red",
      productTitle: "MLB - Limited Edition Team Colors Logo T-Shirt",
      productSlug: "mlb-limited-edition-team-colors-logo"
    },
    {
      detailId: 106,
      price: 1750000,
      quantity: 20,
      colors: ["black", "white", "gray"],
      imageUrls: [
        "https://product.hstatic.net/200000642007/product/50whs_3atsb1843_2_d974fe1e8b664a74b17644cacd43fe8d_6d6063e6e409442d88cbc2d5d0886c51_master.jpg",
        "https://product.hstatic.net/200000642007/product/50whs_3atsb1843_3_3645df7dc2e64185879d0f0bce0c41d2_51289e8a86bf4279accd344c3c8c35a7_master.jpg"
      ],
      colorName: "black",
      productTitle: "MLB - Premium Cotton Blend Casual T-Shirt",
      productSlug: "mlb-premium-cotton-blend-casual"
    }
  ];

  const items = getMockRelatedProducts();

  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items, ...items];
  }, [items]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      startIndex: items.length,
    },
    [
      Autoplay({
        delay: 10000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      })
    ]
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

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="mx-auto px-12 max-w-none">
        {/* Header */}
        <div className="mb-6 md:mb-8 relative">
          <h2 className="text-[20px] leading-7 font-bold text-gray-900 border-b-[3px] border-black pb-2">
            You may also like
          </h2>
        </div>

        {/* Embla Carousel with Navigation */}
        <div className="relative">
          {/* Navigation Buttons */}
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
                            className={`w-3 h-3 rounded-full transition-transform hover:scale-110 ${
                              color === 'black' ? 'bg-black' :
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