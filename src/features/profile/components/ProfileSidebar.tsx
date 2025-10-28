'use client';

import React, { useState } from 'react';

interface ProfileSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

type TabGroup = 'purchase' | 'operation' | 'settings';

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection = 'purchase-info',
  onSectionChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabGroup>('purchase');

  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setIsMenuOpen(false);
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      'membership-info': 'Membership tier information',
      'order-info': 'Order Information',
      'order-tracking': 'Order tracking',
      'update-phone': 'Update your phone',
      'wishlist': 'Wishlist',
      'recently-viewed': 'Recently Viewed',
      'my-reviews': 'My Reviews',
      'my-vouchers': 'Vouchers',
      'shipping-address': 'Shipping address',
      'my-info': 'My info',
      'delete-account': 'Delete account',
    };
    return labels[section] || 'Menu';
  };

  const MenuItem = ({ section, label }: { section: string; label: string }) => (
    <li className="m-0">
      <button
        className={`block w-full text-left px-3 lg:px-0 py-2 lg:py-1.5 text-xs lg:text-sm transition-all duration-200 border-none cursor-pointer rounded-md lg:rounded-none ${
          activeSection === section
            ? 'text-white bg-black lg:text-black lg:bg-white font-medium lg:font-semibold'
            : 'text-gray-700 lg:text-black hover:bg-gray-50 lg:hover:bg-white lg:hover:text-[rgb(187,146,68)] font-normal lg:font-semibold'
        }`}
        onClick={() => handleSectionClick(section)}
      >
        {label}
      </button>
    </li>
  );

  return (
    <aside className="w-full lg:w-64 bg-white">
      {/* Mobile Menu Toggle - Only show if not on account overview */}
      {activeSection !== 'account' && (
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span className="text-sm font-medium text-black">
              {getSectionLabel(activeSection || '')}
            </span>
            <svg
              className={`w-4 h-4 text-black transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar Content */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block bg-white lg:bg-transparent rounded-lg lg:rounded-none border lg:border-0 border-gray-200 p-3 lg:p-0`}>
        <div className="pb-4 lg:pb-8 hidden lg:block">
          <h2 className="text-xl font-semibold text-black">Account</h2>
        </div>
        
        {/* Remove Account Overview from mobile menu since it's shown on main content */}

        {/* Tab Groups - Mobile */}
        <div className="lg:hidden mb-4">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'purchase'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Purchase
            </button>
            <button
              onClick={() => setActiveTab('operation')}
              className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'operation'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        <nav>
          {/* Purchase Information */}
          <div className={`${activeTab === 'purchase' ? 'block' : 'hidden'} lg:block`}>
            <div className="pb-1.5 lg:pb-2 text-[10px] lg:text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider hidden lg:block">
              Purchase information &gt;
            </div>
            <ul className="list-none m-0 p-0 space-y-0.5 lg:space-y-0">
              <MenuItem section="membership-info" label="Membership tier information" />
              <MenuItem section="order-info" label="Order Information" />
              <MenuItem section="order-tracking" label="Order tracking" />
              <li className="m-0 pb-3 lg:pb-8">
                <button
                  className={`block w-full text-left px-3 lg:px-0 py-2 lg:py-1.5 text-xs lg:text-sm transition-all duration-200 border-none cursor-pointer rounded-md lg:rounded-none ${
                    activeSection === 'update-phone'
                      ? 'text-white bg-black lg:text-black lg:bg-white font-medium lg:font-semibold'
                      : 'text-gray-700 lg:text-black hover:bg-gray-50 lg:hover:bg-white lg:hover:text-[rgb(187,146,68)] font-normal lg:font-semibold'
                  }`}
                  onClick={() => handleSectionClick('update-phone')}
                >
                  Update your phone
                </button>
              </li>
            </ul>
          </div>
          
          {/* Operation Information */}
          <div className={`${activeTab === 'operation' ? 'block' : 'hidden'} lg:block mt-3 lg:mt-0`}>
            <div className="pb-1.5 lg:pb-2 text-[10px] lg:text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider hidden lg:block">
              Operation Information &gt;
            </div>
            <ul className="list-none m-0 p-0 space-y-0.5 lg:space-y-0">
              <MenuItem section="wishlist" label="Wishlist" />
              <MenuItem section="recently-viewed" label="Recently Viewed" />
              <MenuItem section="my-reviews" label="My Reviews" />
              <li className="m-0 pb-3 lg:pb-8">
                <button
                  className={`block w-full text-left px-3 lg:px-0 py-2 lg:py-1.5 text-xs lg:text-sm transition-all duration-200 border-none cursor-pointer rounded-md lg:rounded-none ${
                    activeSection === 'my-vouchers'
                      ? 'text-white bg-black lg:text-black lg:bg-white font-medium lg:font-semibold'
                      : 'text-gray-700 lg:text-black hover:bg-gray-50 lg:hover:bg-white lg:hover:text-[rgb(187,146,68)] font-normal lg:font-semibold'
                  }`}
                  onClick={() => handleSectionClick('my-vouchers')}
                >
                  Vouchers
                </button>
              </li>
            </ul>
          </div>
          
          {/* Account Settings */}
          <div className={`${activeTab === 'settings' ? 'block' : 'hidden'} lg:block mt-3 lg:mt-0`}>
            <div className="pb-1.5 lg:pb-2 text-[10px] lg:text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider hidden lg:block">
              Account Settings &gt;
            </div>
            <ul className="list-none m-0 p-0 space-y-0.5 lg:space-y-0">
              <MenuItem section="shipping-address" label="Shipping address" />
              <MenuItem section="my-info" label="My info" />
              <MenuItem section="delete-account" label="Delete account" />
              <li className="m-0">
                <button
                  className={`block w-full text-left px-3 lg:px-0 py-2 lg:py-1.5 text-xs lg:text-sm transition-all duration-200 border-none cursor-pointer rounded-md lg:rounded-none ${
                    activeSection === 'logout'
                      ? 'text-white bg-black lg:text-black lg:bg-white font-medium lg:font-semibold'
                      : 'text-gray-700 lg:text-black hover:bg-gray-50 lg:hover:bg-white lg:hover:text-[rgb(187,146,68)] font-normal lg:font-semibold'
                  }`}
                  onClick={() => handleSectionClick('logout')}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};
