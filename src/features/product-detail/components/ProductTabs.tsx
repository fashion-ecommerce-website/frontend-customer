'use client';

import React, { useState } from 'react';
import { ProductDetail } from '@/services/api/productApi';

interface ProductTabsProps {
  product: ProductDetail;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('INFORMATION');

  const tabs = [
    { key: 'INFORMATION', label: 'INFORMATION' },
    { key: 'PRODUCT CARE', label: 'PRODUCT CARE' },
    { key: 'EXCHANGE & RETURN', label: 'EXCHANGE & RETURN' }
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
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Wash with water at 30℃
                </li>
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Dry in a well-ventilated area with mild sunlight
                </li>
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Do not wash with items of different colors
                </li>
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Avoid using strong detergents or bleach
                </li>
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Do not dry under direct sunlight
                </li>
                <li className="text-[#202846] text-xs md:text-sm font-normal font-['Product Sans'] leading-relaxed md:leading-loose">
                  Select the appropriate washing mode as indicated on the product tag
                </li>
              </ul>
            </div>
          </div>
        );

      case 'EXCHANGE & RETURN':
        return (
          <div className="w-full relative min-h-[150px] md:min-h-[200px]">
            <div className="w-full inline-flex flex-col justify-start items-start">
              <div className="item-content-tab content-policy-return active" data-tab="tab4">
                <p className="text-xs md:text-sm leading-5 text-[#202846]">Applicable to all apparel products at full price or with a discount of no more than 30%.</p>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2"><strong className="text-[#202846]">Return/Exchange Period:</strong></p>
                <ul className="list-disc pl-6 md:pl-8 py-2 md:py-2.5 space-y-2 md:space-y-3 text-xs md:text-sm leading-5 text-[#202846]">
                  <li>
                    <p className="text-[#202846]"><strong className="text-[#202846]">Exchange:</strong> Within 30 days from the date the customer receives the product.</p>
                  </li>
                  <li>
                    <p className="text-[#202846]"><strong className="text-[#202846]">Return:</strong> Within 3 days from the date the customer receives the product.</p>
                  </li>
                </ul>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2"><strong className="text-[#202846]">Notes:</strong></p>
                <ul className="list-disc pl-6 md:pl-8 py-2 md:py-2.5 space-y-2 md:space-y-3 text-xs md:text-sm leading-5 text-[#202846]">
                  <li>
                    <p className="text-[#202846]">Not applicable to products discounted by 30% or more or products purchased directly at Maison&apos;s retail stores.</p>
                  </li>
                  <li>
                    <p className="text-[#202846]">For orders using promotional programs, only product exchanges and coupon refunds are allowed — no cash refunds.</p>
                  </li>
                </ul>
                <p className="text-xs md:text-sm leading-5 text-[#202846] mt-2">
                  <strong className="text-[#202846]">Remark:</strong><br />
                  The return/exchange period is calculated from the date the customer receives the product to the date it is handed over to the shipping carrier for return/exchange.<br />
                  Please refer to our Return &amp; Exchange Policy for more information.
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