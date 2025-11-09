'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { MeasurementsForm } from '@/components/size-recommendation';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function MeasurementsModal({ isOpen, onClose, onSave }: MeasurementsModalProps) {
  if (!isOpen || typeof window === 'undefined') return null;

  const handleSaveSuccess = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Measurements</h2>
              <p className="text-sm text-blue-100">Get personalized size recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
          <MeasurementsForm 
            onSave={handleSaveSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
