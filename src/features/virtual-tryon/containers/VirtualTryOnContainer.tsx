"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VirtualTryOnPresenter } from '../components/VirtualTryOnPresenter';
import { VirtualTryOnIntroModal, VirtualTryOnWaitingModal } from '@/components/modals';
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
    clearSlot,
    showWaitingModal,
    dismissWaitingModal
  } = useVirtualTryOn();

  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      const flag = localStorage.getItem('virtual_tryon_show_intro');
      if (flag === '1') {
        setShowIntro(true);
        localStorage.removeItem('virtual_tryon_show_intro');
      }
    } catch (e) {
      console.log('Virtual_tryon_show_intro:', e);
    }
  }, []);


  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/cart');
  }, [router]);

  return (
    <>
      <VirtualTryOnIntroModal
        isOpen={showIntro}
        onClose={() => setShowIntro(false)}
        onStart={() => setShowIntro(false)}
      />

      <VirtualTryOnWaitingModal
        isOpen={showWaitingModal}
        onClose={() => { dismissWaitingModal(); }}
        status={isProcessing ? 'Processing' : undefined}
      />

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
    </>
  );
};

