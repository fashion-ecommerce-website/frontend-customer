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
      // Convert base64 user image to File
      const userImageFile = await base64ToFile(userImage, 'user-photo.jpg');
      
      // Fetch product image and convert to File
      const productImageResponse = await fetch(selectedProduct.imageUrl);
      const productImageBlob = await productImageResponse.blob();
      const productImageFile = new File([productImageBlob], 'product.jpg', { type: 'image/jpeg' });

      // Create FormData for API request
      const formData = new FormData();
      formData.append('model_image', userImageFile);
      formData.append('cloth_image', productImageFile);
      formData.append('cloth_type', 'upper'); // Can be made dynamic based on product category

      // Step 1: Create virtual try-on task
      const createResponse = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create virtual try-on task');
      }

      const createData = await createResponse.json();
      
      if (!createData.success || !createData.taskId) {
        throw new Error(createData.error || 'Failed to create task');
      }

      const taskId = createData.taskId;
      console.log('✅ Task created:', taskId);

      // Step 2: Poll for task completion
      const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max
      const pollInterval = 2000; // 2 seconds

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Wait before polling
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const statusResponse = await fetch(`/api/virtual-tryon?taskId=${taskId}`);
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check task status');
        }

        const statusData = await statusResponse.json();

        if (!statusData.success) {
          throw new Error(statusData.error || 'Failed to get status');
        }

        console.log(`📊 Task status (attempt ${attempt + 1}):`, statusData.status);

        // Check if completed
        if (statusData.status === 'COMPLETED' && statusData.resultImageUrl) {
          setResultImage(statusData.resultImageUrl);
          setIsProcessing(false); // Ensure processing state is updated
          console.log('✅ Virtual try-on completed!');
          return;
        }

        // Check if failed
        if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Virtual try-on processing failed');
        }

        // Continue polling for 'pending' or 'processing' status
      }

      // If we reach here, it timed out
      throw new Error('Virtual try-on timed out. Please try again.');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process virtual try-on. Please try again.');
      console.error('Virtual try-on error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedProduct, userImage]);

  // Helper: Convert base64 to File
  const base64ToFile = async (base64: string, filename: string): Promise<File> => {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

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
