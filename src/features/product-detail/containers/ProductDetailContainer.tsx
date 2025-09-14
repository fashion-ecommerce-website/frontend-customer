'use client';

import React, { useEffect, useState } from 'react';
import { ProductDetail, productApi } from '@/services/api/productApi';
import { ProductDetailProps } from '../types';
import { ProductDetailPresenter } from '.';
import { LoadingSpinner } from '@/components';
import { mockProductData } from '../mockData';

export function ProductDetailContainer({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from API first
        try {
          const response = await productApi.getProductById(productId);
          
          if (response.success && response.data) {
            setProduct(response.data);
            // Set default selections
            if (response.data.colors.length > 0) {
              setSelectedColor(response.data.colors[0]);
            }
            if (response.data.sizes.length > 0) {
              setSelectedSize(response.data.sizes[0]);
            }
            return;
          }
        } catch (apiError) {
          console.log('API not available, using mock data');
        }
        
        // Fallback to mock data for development
        const mockData = {
          ...mockProductData,
          id: parseInt(productId)
        };
        
        setProduct(mockData);
        // Set default selections
        if (mockData.colors.length > 0) {
          setSelectedColor(mockData.colors[0]);
        }
        if (mockData.sizes.length > 0) {
          setSelectedSize(mockData.sizes[0]);
        }
        
        } catch (err) {
        setError('An error occurred while loading the product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPresenter
      product={product}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
      onColorSelect={setSelectedColor}
      onSizeSelect={setSelectedSize}
    />
  );
}