"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { Product as SharedProduct } from "@/types/product.types";

interface Product {
  detailId: number;
  productSlug: string;
  productTitle: string;
  price: number;
  finalPrice?: number;
  percentOff?: number;
  imageUrls: string[];
  colors: string[];
  quantity?: number;
}

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  onProductClick?: (detailId: number, slug: string) => void;
}

// Adapter function to convert carousel Product to shared Product type
const convertToSharedProduct = (item: Product): SharedProduct => ({
  id: item.detailId.toString(),
  name: item.productTitle,
  brand: "",
  price: item.price,
  finalPrice: item.finalPrice,
  percentOff: item.percentOff,
  image: item.imageUrls[0] || "",
  images: item.imageUrls,
  category: "",
  colors: item.colors,
  sizes: [],
});

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

  const handleProductClick = (productId: string) => {
    const product = products.find(p => p.detailId.toString() === productId);
    if (!product) return;
    
    if (onProductClick) {
      onProductClick(product.detailId, product.productSlug);
    } else {
      router.push(`/products/${product.detailId}`);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${title ? 'py-8 sm:py-12' : ''}`}>
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-4 sm:px-6 lg:px-12">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Navigation Arrows */}
        {canScrollPrev && (
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
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
            className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
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
              const sharedProduct = convertToSharedProduct(product);
              
              return (
                <div
                  key={product.detailId}
                  className="flex-[0_0_calc(50%-0.5rem)] sm:flex-[0_0_calc(33.33%-1rem)] md:flex-[0_0_calc(25%-1.125rem)] lg:flex-[0_0_calc(20%-1.2rem)] min-w-0"
                >
                  <ProductCard
                    product={sharedProduct}
                    onProductClick={handleProductClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
