'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export default function PrivacyPage() {
  const { translations: t } = useLanguage();

  const sections = [
    { title: t.privacy.section1Title, content: t.privacy.section1Content },
    { title: t.privacy.section2Title, content: t.privacy.section2Content },
    { title: t.privacy.section3Title, content: t.privacy.section3Content },
    { title: t.privacy.section4Title, content: t.privacy.section4Content },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t.privacy.title}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t.privacy.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="text-gray-600 leading-relaxed flex">
                        <span className="text-[#3a3839] mr-3">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
