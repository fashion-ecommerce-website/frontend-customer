"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/providers/ToastProvider';
import useLanguage from '@/hooks/useLanguage';

interface VirtualTryOnWaitingModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string | number;
  status?: string; // optional status text
}

export function VirtualTryOnWaitingModal({ isOpen, onClose, status }: VirtualTryOnWaitingModalProps) {
  const { showInfo } = useToast();

  const { translations } = useLanguage();
  const t = translations.virtualTryOn;

  useEffect(() => {
    if (!isOpen) return;

    // Notify user that try-on started
    showInfo(t.waitingToast || 'Virtual try-on is being processed. You can continue browsing; we will notify you when it is done.', 5000);

    return () => {};
  }, [isOpen, showInfo, t.waitingToast]);

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-black">{t.waitingTitle || 'Virtual Try-On Processing'}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-black hover:bg-gray-100 rounded p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="w-6 h-6 animate-spin text-black" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 text-sm text-black">
            <p className="font-medium">{t.waitingMessage || "We're generating your result. Estimated time: a few seconds to a few minutes."}</p>
            {status && <p className="text-xs text-black mt-1">{status}</p>}
            <p className="text-xs text-black mt-2">{t.waitingAdditional || 'You may close this window and continue browsing. We will notify you when processing is complete.'}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 rounded-md border hover:bg-gray-50 text-black">Đóng</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
