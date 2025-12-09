'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { MeasurementsWizard } from '@/components/size-recommendation/MeasurementsWizard';
import { getMeasurements } from '@/utils/localStorage/measurements';
import { recommendationApi } from '@/services/api/recommendationApi';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  productImage?: string;
}

export function MeasurementsModal({ isOpen, onClose, onSave, productImage }: MeasurementsModalProps) {
  if (!isOpen || typeof window === 'undefined') return null;

  const handleSaveSuccess = async (measurements: any) => {
    console.log('💾 Saving measurements:', measurements);
    
    try {
      // Try to sync with backend
      console.log('🔄 Syncing to backend API...');
      const response = await recommendationApi.saveMeasurements(measurements);
      console.log('✅ Backend save response:', response);
      
      if (response.success) {
        console.log('✅ Measurements successfully synced to backend');
      } else {
        console.warn('⚠️ Backend returned unsuccessful response:', response.message);
      }
    } catch (error) {
      console.error('❌ Failed to sync measurements to backend:', error);
      // Continue anyway as they are saved in local storage
    }

    if (onSave) {
      onSave();
    }
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        // Only close if clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[90vh] overflow-hidden animate-fadeIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">FIT FINDER</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Wizard takes full height */}
        <div className="flex-1 overflow-hidden">
          <MeasurementsWizard
            onSave={handleSaveSuccess}
            onCancel={onClose}
            initialData={getMeasurements()}
            productImage={productImage}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
