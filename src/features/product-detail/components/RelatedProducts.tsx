'use client';

import React, { useEffect, useState } from 'react';
import { ProductItem, productApi } from '@/services/api/productApi';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductsProps {
  category: string;
}

export function RelatedProducts({ category }: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productApi.getProducts({
          category,
          pageSize: 8,
          page: 1,
        });

        if (response.success && response.data) {
          setProducts(response.data.items.slice(0, 6)); // Show only 6 products
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          You may also like
        </h2>
        <div className="w-full h-0.5 bg-black"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product.detailId}
            href={`/products/${product.detailId}`}
            className="group block"
          >
            <div className="space-y-2">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {/* Sale Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                </div>
                
                <Image
                  src={product.imageUrls[0] || '/placeholder-product.jpg'}
                  alt={product.productTitle}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700">
                  {product.productTitle}
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-bold text-red-600">
                    {formatPrice(Math.floor(product.price * 0.8))}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex space-x-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Recently Viewed Section */}
      <div className="space-y-8 mt-16">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Recently Viewed
          </h2>
          <div className="w-full h-0.5 bg-black"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 4).map((product) => (
            <Link
              key={`recent-${product.detailId}`}
              href={`/products/${product.detailId}`}
              className="group block"
            >
              <div className="space-y-2">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {/* Sale Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  </div>
                  
                  <Image
                    src={product.imageUrls[0] || '/placeholder-product.jpg'}
                    alt={product.productTitle}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700">
                    {product.productTitle}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-red-600">
                      {formatPrice(Math.floor(product.price * 0.8))}
                    </p>
                    <p className="text-xs text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex space-x-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}