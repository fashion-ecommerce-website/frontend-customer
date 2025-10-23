"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductSelectorProps } from '../types';

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  disabled = false
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-center text-gray-500">
          No products available for virtual try-on
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Product to Try On
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev || disabled}
            className={`p-2 rounded-full border transition-all ${
              canScrollPrev && !disabled
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext || disabled}
            className={`p-2 rounded-full border transition-all ${
              canScrollNext && !disabled
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Next products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)] min-w-0"
            >
              <button
                onClick={() => !disabled && onProductSelect(product)}
                disabled={disabled}
                className={`relative w-full p-4 border-2 rounded-xl transition-all text-left group flex flex-col h-full ${
                  selectedProduct?.id === product.id
                    ? 'border-black bg-gradient-to-br from-gray-50 to-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                } ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {/* Selection Badge */}
                {selectedProduct?.id === product.id && (
                  <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1.5 shadow-lg z-10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Product Image - fixed height in rem so layout is stable */}
                <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100" style={{ height: '10rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.productTitle}
                    style={{ height: '10rem' }}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Info - fixed area so long titles/tags won't grow card height */}
                <div className="space-y-2 flex-1 flex flex-col justify-between" style={{ minHeight: '6.5rem' }}>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 leading-tight" style={{ minHeight: '3rem' }}>
                      <span className="line-clamp-2">{product.productTitle}</span>
                    </h4>

                    <div className="flex items-center gap-2 text-xs flex-wrap mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        {product.colorName}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        {product.sizeName}
                      </span>
                    </div>
                  </div>

                  <p className="text-base font-bold text-gray-900 mt-3">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>
    </div>
  );
};
