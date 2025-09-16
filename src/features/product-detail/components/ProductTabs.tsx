'use client';

import React, { useState } from 'react';
import { ProductDetail } from '@/services/api/productApi';

interface ProductTabsProps {
  product: ProductDetail;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('PRODUCT INFORMATION');

  const tabs = [
    'PRODUCT INFORMATION',
    'CARE INSTRUCTIONS',
    'SUPPORT POLICY'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'PRODUCT INFORMATION':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Features</h3>
              <ul className="space-y-2 text-gray-800">
                {product.description.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'CARE INSTRUCTIONS':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Care Instructions</h3>
            <ul className="space-y-2 text-gray-800">
              <li>• Machine wash at normal temperature with gentle cycle</li>
              <li>• Do not use bleach</li>
              <li>• Air dry naturally, avoid direct sunlight</li>
              <li>• Iron at low temperature</li>
              <li>• Do not dry clean</li>
              <li>• Store in dry, well-ventilated place</li>
            </ul>
          </div>
        );

      case 'SUPPORT POLICY':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Support Policy</h3>
            <div className="space-y-4 text-gray-800">
              <div>
                <h4 className="font-medium mb-2">Returns & Exchanges:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• 30-day return policy</li>
                  <li>• Items must have original tags</li>
                  <li>• No washing, staining, or damage</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Shipping:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Nationwide delivery</li>
                  <li>• Free shipping on orders over 500,000₫</li>
                  <li>• Delivery time: 2-5 business days</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Customer Support:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Hotline: 1900-1234</li>
                  <li>• Email: support@mlb.vietnam.com</li>
                  <li>• Online chat: 8:00 AM - 10:00 PM</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm uppercase transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}