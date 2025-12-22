"use client";

import React from "react";
import { createPortal } from "react-dom";
import useLanguage from '@/hooks/useLanguage';

interface VirtualTryOnIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart?: () => void; // Called when user wants to start try-on
}

export function VirtualTryOnIntroModal({
  isOpen,
  onClose,
  onStart,
}: VirtualTryOnIntroModalProps) {
  const { translations } = useLanguage();
  if (!isOpen || typeof window === "undefined") return null;
  const t = translations.virtualTryOn;

  const header = t.introTitle || t.title;
  const subtitle = t.introSubtitle || '';
  const bullets = t.introBullets || t.bullets || [];
  const startLabel = t.startButton || t.tryOnNow || 'Start';
  const privacyTitle = t.privacyNoticeTitle;
  const privacyParagraphs = t.privacyNoticeParagraphs || [];

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fadeIn">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-black">{header}</h2>
            {subtitle && <p className="text-sm text-black mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-black hover:bg-gray-100 rounded p-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {privacyTitle && (
          <div
            className="mt-0 mb-4 p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-600 text-sm text-black"
            role="note"
            aria-label="Photo usage policy"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-base mb-1">{privacyTitle}</div>
                <div className="space-y-1 text-sm">
                  {privacyParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm text-black">
          {bullets.map((b, idx) => (
            <p key={idx}>{b}</p>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={() => {
              onStart?.();
            }}
            className="px-4 py-3 rounded-md bg-black text-white font-semibold hover:opacity-95 cursor-pointer"
          >
            {startLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
