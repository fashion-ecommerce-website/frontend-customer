'use client';

import React, { useState } from 'react';
import { User } from '../types/profile.types';
import { AccountOverview } from './AccountOverview';

interface ProfileSidebarProps {
  user: User;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  activeSection = 'my-info',
  onSectionChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setIsMenuOpen(false);
  };

  // Icon cho menu items
  const getIcon = (section: string) => {
    const icons: Record<string, React.ReactNode> = {
      'membership-info': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'order-info': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      'order-tracking': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      'wishlist': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'recently-viewed': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'my-reviews': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      'my-vouchers': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      'shipping-address': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'my-info': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'delete-account': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      'logout': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      'my-refund': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
    };
    return icons[section] || null;
  };

  const menuItems = [
    { section: 'membership-info', label: 'Membership tier' },
    { section: 'order-info', label: 'Order Information' },
    { section: 'order-tracking', label: 'Order tracking' },
    { section: 'my-refund', label: 'My Refund' },
    { section: 'wishlist', label: 'Wishlist' },
    { section: 'recently-viewed', label: 'Recently Viewed' },
    { section: 'my-reviews', label: 'My Reviews' },
    { section: 'my-vouchers', label: 'Vouchers' },
    { section: 'shipping-address', label: 'Shipping address' },
    { section: 'my-info', label: 'My info' },
    { section: 'logout', label: 'Logout' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden border-b border-gray-200">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all"
        >
          <span className="text-sm font-semibold text-gray-900">Menu</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Account Overview with Avatar */}
        <AccountOverview user={user} />
        
        {/* Menu Buttons */}
        <nav className="py-3">
          <ul className="list-none m-0 p-0 space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={item.section} className="m-0">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-none cursor-pointer rounded-lg ${
                    activeSection === item.section
                      ? ' bg-gray-700 text-white font-semibold shadow-md transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm font-medium'
                  }`}
                  onClick={() => handleSectionClick(item.section)}
                >
                  <span className={`flex-shrink-0 ${activeSection === item.section ? 'text-white' : 'text-gray-500'}`}>
                    {getIcon(item.section)}
                  </span>
                  <span className="text-left flex-1">{item.label}</span>
                  {activeSection === item.section && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                {/* Divider after certain items */}
                {(index === 3 || index === 7) && (
                  <div className="my-2 border-t border-gray-200"></div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
