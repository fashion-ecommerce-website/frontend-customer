"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VirtualTryOnPresenter } from '../components/VirtualTryOnPresenter';
import { VirtualTryOnContainerProps, VirtualTryOnProduct } from '../types';

export const VirtualTryOnContainer: React.FC<VirtualTryOnContainerProps> = ({
  products
}) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<VirtualTryOnProduct | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle product selection
  const handleProductSelect = useCallback((product: VirtualTryOnProduct) => {
    setSelectedProduct(product);
    setError(null);
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle virtual try-on
  const handleTryOn = useCallback(async () => {
    if (!selectedProduct || !userImage) {
      setError('Please select a product and upload your photo');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Replace with actual API call to virtual try-on service
      // For now, simulate processing with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock result - in production, this would be the API response
      // For demonstration, we'll just use the user image
      setResultImage(userImage);
      
      // In a real implementation, you would call something like:
      // const response = await virtualTryOnApi.processImage({
      //   userImage,
      //   productImage: selectedProduct.imageUrl,
      //   productId: selectedProduct.productDetailId
      // });
      // setResultImage(response.data.resultImageUrl);
      
    } catch (err) {
      setError('Failed to process virtual try-on. Please try again.');
      console.error('Virtual try-on error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedProduct, userImage]);

  // Handle reset
  const handleReset = useCallback(() => {
    setResultImage(null);
    setError(null);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/cart');
  }, [router]);

  return (
    <VirtualTryOnPresenter
      products={products}
      selectedProduct={selectedProduct}
      userImage={userImage}
      resultImage={resultImage}
      isProcessing={isProcessing}
      error={error}
      onProductSelect={handleProductSelect}
      onImageUpload={handleImageUpload}
      onTryOn={handleTryOn}
      onReset={handleReset}
      onBack={handleBack}
    />
  );
};
