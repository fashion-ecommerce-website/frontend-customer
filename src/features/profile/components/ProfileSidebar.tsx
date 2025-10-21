'use client';

import React from 'react';

interface ProfileSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection = 'purchase-info',
  onSectionChange,
}) => {
  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white h-fit">
      <div className="pb-8">
        <h2 className="text-xl font-semibold text-black">Account</h2>
      </div>
      
      <nav>
        <ul className="list-none m-0 p-0">
          <li className="m-0">
            <div className="pb-2 text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider">
              Purchase information &gt;
            </div>
          </li>
          <li className="m-0">
            <button 
              className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                activeSection === 'membership-info' 
                  ? 'text-black bg-white' 
                  : 'text-black hover:text-[rgb(187,146,68)] bg-white'
              }`}
              onClick={() => handleSectionClick('membership-info')}
            >
              Membership tier information
            </button>
          </li>
          <li className="m-0">
            <button 
              className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                activeSection === 'order-info' 
                  ? 'text-black bg-white' 
                  : 'text-black hover:text-[rgb(187,146,68)] bg-white'
              }`}
              onClick={() => handleSectionClick('order-info')}
            >
              Order Information
            </button>
          </li>
          <li className="m-0">
            <button 
              className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                activeSection === 'order-tracking' 
                  ? 'text-black bg-white' 
                  : 'text-black hover:text-[rgb(187,146,68)] bg-white'
              }`}
              onClick={() => handleSectionClick('order-tracking')}
            >
              Order tracking
            </button>
          </li>
          <li className="m-0 pb-8">
            <button 
              className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                activeSection === 'update-phone' 
                  ? 'text-black bg-white' 
                  : 'text-black hover:text-[rgb(187,146,68)] bg-white'
              }`}
              onClick={() => handleSectionClick('update-phone')}
            >
              Update your phone
            </button>
          </li>
        </ul>
        
        <div>
          <div className="pb-2 text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider">
            Operation Information &gt;
          </div>
          <ul className="list-none m-0 p-0">
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'wishlist' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('wishlist')}
              >
                Wishlist
              </button>
            </li>
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'recently-viewed' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('recently-viewed')}
              >
                Recently Viewed
              </button>
            </li>
            <li className="m-0 pb-8">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'my-reviews' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('my-reviews')}
              >
                My Reviews
                  activeSection === 'my-vouchers' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('my-vouchers')}
              >
                Vouchers
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <div className="pb-2 text-xs font-semibold text-[rgb(120,120,120)] uppercase tracking-wider">
            Account Settings &gt;
          </div>
          <ul className="list-none m-0 p-0">
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'shipping-address' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('shipping-address')}
              >
                Shipping address
              </button>
            </li>
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'my-info' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('my-info')}
              >
                My info
              </button>
            </li>
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'delete-account' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('delete-account')}
              >
                Delete account
              </button>
            </li>
            <li className="m-0">
              <button 
                className={`block w-full text-left pt-1.5 text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${
                  activeSection === 'logout' 
                    ? 'text-black bg-white' 
                    : 'text-black hover:text-[rgb(187,146,68)] bg-white'
                }`}
                onClick={() => handleSectionClick('logout')}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
