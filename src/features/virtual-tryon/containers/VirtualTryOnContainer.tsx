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
    history,
    activeSlot,
    handleProductSelect,
    handleImageUpload,
    handleTryOn,
    handleReset,
    handleHistorySelect,
    setActiveSlot,
    clearSlot
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
      history={history}
      activeSlot={activeSlot}
      onProductSelect={handleProductSelect}
      onImageUpload={handleImageUpload}
      onTryOn={handleTryOn}
      onReset={handleReset}
      onBack={handleBack}
      onHistorySelect={handleHistorySelect}
      onActiveSlotChange={setActiveSlot}
      onClearSlot={clearSlot}
    />
  );
};

