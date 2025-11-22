"use client";

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VirtualTryOnPresenter } from '../components/VirtualTryOnPresenter';
import { VirtualTryOnContainerProps } from '../types';
import { useVirtualTryOn } from '../context/VirtualTryOnContext';

export const VirtualTryOnContainer: React.FC<VirtualTryOnContainerProps> = ({
  products
}) => {
  const router = useRouter();
  const {
    selectedProduct,
    selectedLowerProduct,
    userImage,
    resultImage,
    isProcessing,
    error,
    history,
    category,
    activeSlot,
    handleProductSelect,
    handleImageUpload,
    handleTryOn,
    handleReset,
    handleHistorySelect,
    setCategory,
    setActiveSlot
  } = useVirtualTryOn();

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/cart');
  }, [router]);

  return (
    <VirtualTryOnPresenter
      products={products}
      selectedProduct={selectedProduct}
      selectedLowerProduct={selectedLowerProduct}
      userImage={userImage}
      resultImage={resultImage}
      isProcessing={isProcessing}
      error={error}
      history={history}
      category={category}
      activeSlot={activeSlot}
      onProductSelect={handleProductSelect}
      onImageUpload={handleImageUpload}
      onTryOn={handleTryOn}
      onReset={handleReset}
      onBack={handleBack}
      onHistorySelect={handleHistorySelect}
      onCategoryChange={setCategory}
      onActiveSlotChange={setActiveSlot}
    />
  );
};

