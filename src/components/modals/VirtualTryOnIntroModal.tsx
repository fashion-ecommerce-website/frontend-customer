"use client";

import React from "react";
import { createPortal } from "react-dom";
import useLanguage from "../../hooks/useLanguage";

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
  const t = translations.virtualTryOnIntroModal;

  if (!isOpen || typeof window === "undefined") return null;

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
            <h2 className="text-xl font-bold text-black">{t.title}</h2>
            <p className="text-sm text-black mt-1">{t.subtitle}</p>
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

        <div className="space-y-3 text-sm text-black">
          <p>{t.step1}</p>
          <p>{t.step2}</p>
          <p>{t.step3}</p>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={() => {
              onStart?.();
            }}
            className="px-4 py-3 rounded-md bg-black text-white font-semibold hover:opacity-95 cursor-pointer"
          >
            {t.startButton}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
