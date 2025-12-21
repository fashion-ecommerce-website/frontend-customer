"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import useLanguage from '../../../hooks/useLanguage';

type Props = {
  onUpgrade?: () => void;
  onBack?: () => void;
};

export const VirtualTryOnAccessIntro: React.FC<Props> = ({ onUpgrade, onBack }) => {
  const router = useRouter();
  const { translations } = useLanguage();

  const vt = translations.virtualTryOn;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white"
      style={{ padding: '2rem' }}
    >
      <div style={{ width: '90%', maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }} className="font-bold text-black">{vt.title}</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ width: '100%', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="2" y="2" width="236" height="136" rx="8" fill="#ffffff" stroke="#e6e9ee" strokeWidth="2" />
                  <g transform="translate(40,20)" fill="#cbd5e1">
                    <rect x="0" y="0" width="160" height="100" rx="6" fill="#eef2ff" />
                    <circle cx="44" cy="40" r="18" fill="#c7d2fe" />
                    <rect x="20" y="72" width="120" height="10" rx="4" fill="#c7d2fe" />
                  </g>
                </svg>
              </div>

              <div style={{ flex: '1 1 220px', minWidth: 220 }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 600 }}>{vt.previewTitle}</h2>
                <p style={{ marginTop: '0.5rem', marginBottom: '0.75rem', color: '#475569' }}>{vt.previewDescription}</p>

                <ul style={{ margin: 0, paddingLeft: '1.15rem', color: '#475569' }}>
                  {vt.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '1rem' }} className="text-black">{vt.upgradeNote}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              if (onUpgrade) return onUpgrade();
              router.push('/profile/upgrade');
            }}
            style={{ padding: '0.75rem 1rem', backgroundColor: '#000', color: '#fff', borderRadius: '0.5rem' }}
          >
            {vt.upgradeButton}
          </button>

          <button
            onClick={() => {
              if (onBack) return onBack();
              router.push('/cart');
            }}
            style={{ padding: '0.75rem 1rem', backgroundColor: '#f3f4f6', color: '#000', borderRadius: '0.5rem' }}
          >
            {vt.backButton}
          </button>
        </div>
      </div>
    </div>
  );
};
