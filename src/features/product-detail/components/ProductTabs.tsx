'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ProductDetail } from '@/services/api/productApi';

interface ProductTabsProps {
  product: ProductDetail;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('INFORMATION');
  const { translations } = useLanguage();

  const tabs = [
    { key: 'INFORMATION', label: translations.product.tabs.information.toUpperCase() },
    { key: 'PRODUCT CARE', label: translations.product.tabs.productCare.toUpperCase() },
    { key: 'EXCHANGE & RETURN', label: translations.product.tabs.exchangeReturn.toUpperCase() }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'INFORMATION':
        return (
          <div className="w-full relative min-h-[150px] md:min-h-[200px]">
            <div className="w-full pl-3 md:pl-5 py-2 md:py-2.5 inline-flex flex-col justify-start items-start">
              <ul className="list-disc pl-6 md:pl-8 py-2 md:py-2.5 space-y-1.5 md:space-y-2 text-xs md:text-sm leading-5 text-[#202846]">
                {product.description.map((feature, index) => (
                  <li key={index}>
                    <p className="text-[#202846]">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'PRODUCT CARE':
        return (
          <div className="w-full relative min-h-[150px] md:min-h-[200px]">
            <div className="w-full pl-3 md:pl-5 py-2 md:py-2.5 inline-flex flex-col justify-start items-start">
              <ul className="list-none space-y-1 md:space-y-0">
                {translations.product.careItems.map((item, idx) => (
                  <li key={idx} className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'EXCHANGE & RETURN':
        return (
          <div className="w-full relative min-h-[150px] md:min-h-[200px]">
            <div className="w-full inline-flex flex-col justify-start items-start">
              <div className="item-content-tab content-policy-return active" data-tab="tab4">
                <p className="text-xs md:text-sm leading-5 text-[#202846]">{translations.product.exchange.applicability}</p>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2"><strong className="text-[#202846]">{translations.product.exchange.returnExchangePeriodLabel}</strong></p>
                <ul className="list-disc pl-6 md:pl-8 py-2 md:py-2.5 space-y-2 md:space-y-3 text-xs md:text-sm leading-5 text-[#202846]">
                  <li>
                    <p className="text-[#202846]"><strong className="text-[#202846]">{translations.product.exchange.exchangeText.split(':')[0]}:</strong> {translations.product.exchange.exchangeText.replace(/^Exchange:\s*/i, '')}</p>
                  </li>
                  <li>
                    <p className="text-[#202846]"><strong className="text-[#202846]">{translations.product.exchange.returnText.split(':')[0]}:</strong> {translations.product.exchange.returnText.replace(/^Return:\s*/i, '')}</p>
                  </li>
                </ul>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2"><strong className="text-[#202846]">{translations.product.exchange.notesTitle}</strong></p>
                <ul className="list-disc pl-6 md:pl-8 py-2 md:py-2.5 space-y-2 md:space-y-3 text-xs md:text-sm leading-5 text-[#202846]">
                  <li>
                    <p className="text-[#202846]">{translations.product.exchange.note1}</p>
                  </li>
                  <li>
                    <p className="text-[#202846]">{translations.product.exchange.note2}</p>
                  </li>
                </ul>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2">
                  <strong className="text-[#202846]">{translations.product.exchange.remarkTitle}</strong><br />
                  {translations.product.exchange.remarkBody}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="w-full inline-flex flex-col justify-start items-start"
      style={{ fontFamily: "'Product Sans Local', Arial, Helvetica, sans-serif" }}
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-3 md:gap-5">
        {/* Tab Navigation */}
        <div className="self-stretch pr-[0.02px] inline-flex justify-between items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`flex-1 py-3 md:py-4 border-b-[2px] md:border-b-[3px] inline-flex flex-col justify-start items-center cursor-pointer whitespace-nowrap min-w-0 ${
                activeTab === tab.key
                  ? 'border-black'
                  : 'border-white'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <div className="self-stretch text-center justify-center text-black text-[10px] md:text-sm font-normal font-['Product Sans'] uppercase leading-tight md:leading-5 px-1">
                {tab.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="self-stretch transition-all duration-300 ease-in-out">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}