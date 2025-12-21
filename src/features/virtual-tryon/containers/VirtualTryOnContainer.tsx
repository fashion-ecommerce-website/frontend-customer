"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VirtualTryOnPresenter } from '../components/VirtualTryOnPresenter';
import { VirtualTryOnIntroModal, VirtualTryOnWaitingModal } from '@/components/modals';
import { VirtualTryOnAccessIntro } from '../components/VirtualTryOnAccessIntro';
import { authUtils } from '@/utils/auth';
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
  const [showRankModal, setShowRankModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);

  // On mount: validate user rank first. If allowed, then consider showing intro modal.
  useEffect(() => {
    try {
      const token = authUtils.getAccessToken();
      if (!token) {
        setIsAllowed(false);
        setShowRankModal(true);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1] || '')) as any;
      const rankId = payload?.rank_id ?? payload?.rankId ?? null;

      if (rankId === 4 || rankId === 5) {
        setIsAllowed(true);
        try {
          const flag = localStorage.getItem('virtual_tryon_show_intro');
          if (flag === '1') {
            setShowIntro(true);
            localStorage.removeItem('virtual_tryon_show_intro');
          }
        } catch (e) {
          console.log('Virtual_tryon_show_intro:', e);
        }
      } else {
        setIsAllowed(false);
        setShowRankModal(true);
      }
    } catch (err) {
      setIsAllowed(false);
      setShowRankModal(true);
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

      {!isAllowed && (
        <VirtualTryOnAccessIntro
          onBack={handleBack}
          onUpgrade={() => router.push('/profile/upgrade')}
        />
      )}

      {isAllowed && (
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
      )}
    </>
  );
};

