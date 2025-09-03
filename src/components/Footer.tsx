'use client';

import React from 'react';
import Link from 'next/link';

// Icon components for social media
const getSocialIcon = (platform: string, className: string) => {
  switch (platform) {
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.295A4.49 4.49 0 013.831 12.5c0-1.297.49-2.448 1.295-3.323A4.49 4.49 0 018.449 7.882c1.297 0 2.448.49 3.323 1.295.805.875 1.295 2.026 1.295 3.323 0 1.297-.49 2.448-1.295 3.323-.875.805-2.026 1.295-3.323 1.295z"/>
        </svg>
      );
    default:
      return null;
  }
};

// Icon components for payment methods
const getPaymentIcon = (method: string, className: string) => {
  switch (method) {
    case 'visa':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <span className="text-blue-600 font-bold text-xs">VISA</span>
        </div>
      );
    case 'mastercard':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <span className="text-red-600 font-bold text-xs">MC</span>
        </div>
      );
    case 'paypal':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <span className="text-blue-700 font-bold text-xs">PayPal</span>
        </div>
      );
    case 'apple-pay':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <span className="text-black font-bold text-xs">Pay</span>
        </div>
      );
    case 'google-pay':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <span className="text-gray-800 font-bold text-xs">GPay</span>
        </div>
      );
    default:
      return (
        <div className={`${className} bg-gray-100 border border-gray-300 rounded`}></div>
      );
  }
};

export const Footer: React.FC = () => {
  const footerData = {
    companyInfo: {
      name: 'FIT',
      description: 'We have clothes that suits your style and which you\'re proud to wear. From women to men.',
      copyright: '© 2000-2025, FIT.com, Inc. or its affiliates'
    },
    socialLinks: [
      { id: 'twitter', platform: 'twitter', href: '#' },
      { id: 'facebook', platform: 'facebook', href: '#' },
      { id: 'instagram', platform: 'instagram', href: '#' }
    ],
    sections: [
      {
        id: 'company',
        title: 'Company',
        links: [
          { id: 'about', label: 'About', href: '/about' },
          { id: 'features', label: 'Features', href: '/features' },
          { id: 'works', label: 'Works', href: '/works' },
          { id: 'career', label: 'Career', href: '/career' }
        ]
      },
      {
        id: 'help',
        title: 'Help',
        links: [
          { id: 'customer-support', label: 'Customer Support', href: '/support' },
          { id: 'delivery-details', label: 'Delivery Details', href: '/delivery' },
          { id: 'terms-conditions', label: 'Terms & Conditions', href: '/terms' },
          { id: 'privacy-policy', label: 'Privacy Policy', href: '/privacy' }
        ]
      },
      {
        id: 'faq',
        title: 'FAQ',
        links: [
          { id: 'account', label: 'Account', href: '/faq/account' },
          { id: 'manage-deliveries', label: 'Manage Deliveries', href: '/faq/deliveries' },
          { id: 'orders', label: 'Orders', href: '/faq/orders' },
          { id: 'payments', label: 'Payments', href: '/faq/payments' }
        ]
      }
    ],
    paymentMethods: [
      { id: 'visa', name: 'Visa' },
      { id: 'mastercard', name: 'Mastercard' },
      { id: 'paypal', name: 'PayPal' },
      { id: 'apple-pay', name: 'Apple Pay' },
      { id: 'google-pay', name: 'Google Pay' }
    ]
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-black mb-4">{footerData.companyInfo.name}</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              {footerData.companyInfo.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {footerData.socialLinks.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform, "w-4 h-4")}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerData.sections.map((section) => (
            <div key={section.id} className="md:col-span-1">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            {footerData.companyInfo.copyright}
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-2">
            {footerData.paymentMethods.map((payment) => (
              <div key={payment.id} title={payment.name}>
                {getPaymentIcon(payment.id, "w-12 h-8")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
