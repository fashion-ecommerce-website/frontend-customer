'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import type { FAQItem } from '@/i18n/types';

type CategoryId = 'account' | 'order' | 'payment' | 'shipping' | 'return' | 'size';

function FAQContent() {
  const searchParams = useSearchParams();
  const { translations: t } = useLanguage();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<CategoryId>('account');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['account', 'order', 'payment', 'shipping', 'return', 'size'].includes(tab)) {
      setActiveCategory(tab as CategoryId);
    }
  }, [searchParams]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryIds: CategoryId[] = ['account', 'order', 'payment', 'shipping', 'return', 'size'];

  const getCategoryItems = (id: CategoryId): FAQItem[] => {
    return t.faq[id];
  };

  const currentItems = getCategoryItems(activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t.faq.title}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t.faq.subtitle}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">{t.faq.categoryLabel}</h3>
                <nav className="space-y-2">
                  {categoryIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeCategory === id
                          ? 'bg-[#3a3839] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{t.faq.categories[id]}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t.faq.categories[activeCategory]}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {currentItems.map((item, index) => {
                    const itemId = `${activeCategory}-${index}`;
                    const isOpen = openItems[itemId];
                    return (
                      <div key={itemId}>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-gray-600 leading-relaxed">{item.answer}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.faq.notFoundTitle}</h2>
          <p className="text-gray-600 mb-6">{t.faq.notFoundDesc}</p>
          <a
            href="/support"
            className="inline-flex items-center px-6 py-3 bg-[#3a3839] text-white rounded-lg hover:bg-[#4a4849] transition-colors"
          >
            {t.faq.contactSupport}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

export default function FAQPage() {
  const { translations: t } = useLanguage();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {t.faq.loading}
        </div>
      }
    >
      <FAQContent />
    </Suspense>
  );
}
