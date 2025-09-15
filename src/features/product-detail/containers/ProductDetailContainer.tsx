'use client';

import React, { useEffect, useState } from 'react';
import { ProductDetail, productApi } from '@/services/api/productApi';
import { ProductDetailProps } from '../types';
import { ProductDetailPresenter } from '.';
import { LoadingSpinner } from '@/components';
import { mockProductData, mockFetchProductByColor } from '../mockData';

export function ProductDetailContainer({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Handle color change with API call
  const handleColorChange = async (color: string) => {
    try {
      // Fetch new product data for this color
      const newProduct = await mockFetchProductByColor(parseInt(productId), color);
      setProduct(newProduct);
      setSelectedColor(color);
      
      // Reset size selection when color changes
      setSelectedSize(null);
    } catch (error) {
      console.error('Error fetching color variant:', error);
      // Keep current product if API call fails
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from API first
        try {
          const response = await productApi.getProductById(productId);
          
          if (response.success && response.data) {
            const productData = response.data;
            setProduct(productData);
            
            // Set default selections based on new API structure
            if (productData.colors.length > 0) {
              // Use activeColor if available, otherwise first color
              setSelectedColor(productData.activeColor || productData.colors[0]);
            }
            
            // Don't auto-select any size - let user choose
            setSelectedSize(null);
            return;
          }
        } catch (apiError) {
          console.log('API not available, using mock data');
        }
        
        // Fallback to mock data for development
        const mockData = {
          ...mockProductData,
          detailId: parseInt(productId) // Update to use detailId instead of id
        };
        
        setProduct(mockData);
        // Set default selections
        if (mockData.colors.length > 0) {
          setSelectedColor(mockData.activeColor || mockData.colors[0]);
        }
        
        // Don't auto-select any size - let user choose
        setSelectedSize(null);
        
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
      onColorChange={handleColorChange}
    />
  );
}