"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";

interface Product {
  detailId: number;
  productSlug: string;
  productTitle: string;
  price: number;
  imageUrls: string[];
  colors: string[];
  quantity?: number;
}

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  onProductClick?: (detailId: number, slug: string) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  onProductClick,
}) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const handleProductClick = (detailId: number, slug: string) => {
    if (onProductClick) {
      onProductClick(detailId, slug);
    } else {
      router.push(`/products/${detailId}`);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8 sm:py-12">
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-4 sm:px-6 lg:px-12">
          {title}
        </h2>
      )}

      <div className="relative px-4 sm:px-6 lg:px-12">
        {/* Navigation Arrows */}
        {canScrollPrev && (
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            aria-label="Previous products"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {canScrollNext && (
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            aria-label="Next products"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5 md:gap-6">
            {products.map((product) => {
              const firstImage = product.imageUrls?.[0] ?? "";
              const secondImage = product.imageUrls?.[1] ?? null;

              return (
                <div
                  key={product.detailId}
                  className="flex-[0_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(33.33%-1rem)] md:flex-[0_0_calc(25%-1.125rem)] lg:flex-[0_0_calc(20%-1.2rem)] min-w-0"
                >
                  <div
                    className="group cursor-pointer transition-all duration-300 ease-out"
                    onClick={() =>
                      handleProductClick(product.detailId, product.productSlug)
                    }
                  >
                    {/* Product Image */}
                    <div className="relative w-full aspect-[4/5] mb-3 sm:mb-4 overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                      {firstImage ? (
                        <>
                          {/* Base image */}
                          <div
                            className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transform group-hover:scale-105 transition-transform duration-500 ease-out"
                            style={{ backgroundImage: `url(${firstImage})` }}
                          />

                          {/* Hover: show second image */}
                          {secondImage && (
                            <div
                              className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100"
                              style={{
                                backgroundImage: `url(${secondImage})`,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1.5 sm:space-y-2 px-1">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-black transition-colors">
                        {product.productTitle}
                      </h3>
                      <p className="text-base sm:text-lg font-bold text-black">
                        {formatPrice(product.price)}
                      </p>
                      {/* Available colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {product.colors.slice(0, 5).map((color, index) => {
                            let colorClass = "";
                            switch (color.toLowerCase()) {
                              case "black":
                                colorClass = "bg-black";
                                break;
                              case "white":
                                colorClass =
                                  "bg-white border-2 border-gray-300";
                                break;
                              case "red":
                                colorClass = "bg-[#FF0000]";
                                break;
                              case "gray":
                                colorClass = "bg-[#CCCACA]";
                                break;
                              case "blue":
                                colorClass = "bg-[#5100FF]";
                                break;
                              case "pink":
                                colorClass = "bg-[#DB999B]";
                                break;
                              case "yellow":
                                colorClass = "bg-[#FFFF05]";
                                break;
                              case "purple":
                                colorClass = "bg-[#B5129A]";
                                break;
                              case "brown":
                                colorClass = "bg-[#753A3A]";
                                break;
                              case "green":
                                colorClass = "bg-[#3CFA08]";
                                break;
                              case "beige":
                                colorClass = "bg-[#DCB49E]";
                                break;
                              case "orange":
                                colorClass = "bg-[#F5B505]";
                                break;
                              default:
                                colorClass = "bg-gray-400";
                            }
                            return (
                              <div
                                key={index}
                                className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full ${colorClass} ring-1 ring-gray-200 transition-transform hover:scale-110`}
                                title={color}
                              />
                            );
                          })}
                          {product.colors.length > 5 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{product.colors.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
