'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
        <Image src="https://www.svgrepo.com/show/506668/instagram.svg" alt="Instagram" className={className} width={20} height={20} />
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 12" className="w-[34px] h-[12px]">
            <path d="M17.0222 1.12124L14.8479 11.2848H12.2188L14.3934 1.12124H17.0222ZM28.0838 7.68387L29.468 3.86711L30.2645 7.68387H28.0838ZM31.0172 11.2848H33.4492L31.327 1.12124H29.0823C28.5779 1.12124 28.1523 1.41461 27.9629 1.86689L24.0184 11.2848H26.7794L27.3276 9.76709H30.7007L31.0172 11.2848ZM24.1554 7.96631C24.1667 5.2838 20.4458 5.13615 20.4715 3.93789C20.4793 3.57278 20.827 3.18547 21.5865 3.08607C21.9638 3.03685 23.0013 2.99922 24.1793 3.54125L24.6405 1.38598C24.0078 1.1563 23.1936 0.935303 22.181 0.935303C19.5824 0.935303 17.7533 2.31693 17.7379 4.29527C17.7215 5.75828 19.0436 6.57471 20.0399 7.0611C21.0641 7.55938 21.4083 7.87849 21.4038 8.32402C21.397 9.00631 20.5867 9.30676 19.8308 9.31866C18.5086 9.33957 17.7414 8.96192 17.1299 8.67691L16.6535 10.9039C17.2676 11.186 18.4015 11.4312 19.5779 11.4437C22.3396 11.4437 24.1464 10.0791 24.1554 7.96631ZM13.2652 1.12124L9.00552 11.2848H6.22587L4.12979 3.17357C4.0024 2.674 3.89174 2.49128 3.50476 2.28058C2.8733 1.93799 1.82944 1.61598 0.911041 1.41654L0.973769 1.12124H5.4474C6.01742 1.12124 6.5305 1.50082 6.65982 2.15737L7.76705 8.03901L10.5029 1.12124H13.2652Z" fill="#1434CB"/>
          </svg>
        </div>
      );
    case 'mastercard':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 16" className="w-[26px] h-[16px]">
            <path d="M16.2698 1.84839H9.40657V14.1819H16.2698V1.84839Z" fill="#FF5F00"/>
            <path d="M9.84239 8.01514C9.84131 6.82733 10.1105 5.65484 10.6295 4.58644C11.1485 3.51804 11.9038 2.58173 12.8382 1.84838C11.6811 0.938865 10.2915 0.37325 8.82809 0.216185C7.36472 0.0591194 5.88668 0.316937 4.5629 0.96018C3.23913 1.60342 2.12304 2.60614 1.3422 3.8537C0.561357 5.10127 0.147278 6.54336 0.147278 8.01514C0.147278 9.48692 0.561357 10.929 1.3422 12.1766C2.12304 13.4241 3.23913 14.4269 4.5629 15.0701C5.88668 15.7133 7.36472 15.9712 8.82809 15.8141C10.2915 15.657 11.6811 15.0914 12.8382 14.1819C11.9039 13.4485 11.1486 12.5122 10.6295 11.4438C10.1105 10.3754 9.84131 9.20294 9.84239 8.01514Z" fill="#EB001B"/>
            <path d="M25.5288 8.01514C25.5289 9.48689 25.1148 10.929 24.334 12.1765C23.5532 13.4241 22.4372 14.4268 21.1134 15.0701C19.7897 15.7133 18.3117 15.9712 16.8483 15.8141C15.385 15.657 13.9953 15.0914 12.8382 14.1819C13.7718 13.4478 14.5265 12.5113 15.0455 11.4431C15.5644 10.3749 15.8341 9.20275 15.8341 8.01514C15.8341 6.82752 15.5644 5.6554 15.0455 4.58717C14.5265 3.51893 13.7718 2.58247 12.8382 1.84838C13.9953 0.938864 15.385 0.373246 16.8483 0.216183C18.3117 0.0591193 19.7897 0.316948 21.1134 0.960198C22.4372 1.60345 23.5532 2.60616 24.334 3.85373C25.1148 5.1013 25.5289 6.54338 25.5288 8.01514Z" fill="#F79E1B"/>
            <path d="M24.7805 12.8756V12.6231H24.8823V12.5716H24.623V12.6231H24.7249V12.8756H24.7805ZM25.2839 12.8756V12.5711H25.2044L25.113 12.7805L25.0215 12.5711H24.942V12.8756H24.9981V12.6459L25.0839 12.8439H25.1421L25.2278 12.6454V12.8756H25.2839Z" fill="#F79E1B"/>
          </svg>
        </div>
      );
    case 'paypal':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <Image src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21~bgwhite.svg" alt="Stripe" className="w-full h-full object-contain" width={56} height={36} />
        </div>
      );
    default:
      return (
        <div className={`${className} bg-gray-100 border border-gray-300 rounded`}></div>
      );
  }
};

export const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('company');

  const footerData = {
    companyInfo: {
      name: 'FIT',
      description: 'Nền tảng thời trang trực tuyến với công nghệ AI, mang đến trải nghiệm mua sắm cá nhân hóa.',
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
        title: 'Công Ty',
        links: [
          { id: 'about', label: 'Về Chúng Tôi', href: '/about' },
          { id: 'terms', label: 'Điều Khoản Sử Dụng', href: '/terms' }
        ]
      },
      {
        id: 'help',
        title: 'Hỗ Trợ',
        links: [
          { id: 'customer-support', label: 'Trung Tâm Hỗ Trợ', href: '/support' },
          { id: 'faq', label: 'Câu Hỏi Thường Gặp', href: '/faq' }
        ]
      },
      {
        id: 'faq',
        title: 'FAQ',
        links: [
          { id: 'account', label: 'Tài Khoản', href: '/faq?tab=account' },
          { id: 'orders', label: 'Đơn Hàng', href: '/faq?tab=order' },
          { id: 'payments', label: 'Thanh Toán', href: '/faq?tab=payment' },
          { id: 'shipping', label: 'Vận Chuyển', href: '/faq?tab=shipping' }
        ]
      }
    ],
    paymentMethods: [
      { id: 'visa', name: 'Visa' },
      { id: 'mastercard', name: 'Mastercard' },
      { id: 'paypal', name: 'PayPal' }
    ]
  };

  return (
    <footer className="bg-[#3a3839] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Desktop Grid Layout - 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {footerData.companyInfo.name}
            </h3>
            <p className="mb-6 text-sm text-[#C4C4C4] leading-relaxed">
              {footerData.companyInfo.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {footerData.socialLinks.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform, "w-5 h-5")}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerData.sections.map((section) => (
            <div key={section.id}>
              <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-[#C4C4C4] hover:text-white text-sm transition-colors duration-200 hover:underline decoration-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Layout with Tabs */}
        <div className="lg:hidden">
          {/* Company Info - Always visible on mobile */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              {footerData.companyInfo.name}
            </h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[#C4C4C4] leading-relaxed">
              {footerData.companyInfo.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {footerData.socialLinks.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform, "w-4 h-4 sm:w-5 sm:h-5")}
                </Link>
              ))}
            </div>
          </div>

          {/* Tab Navigation - Horizontal Scroll */}
          <div className="flex space-x-2 overflow-x-auto pb-3 mb-4 border-b border-gray-600 hide-scrollbar">
            {footerData.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200
                  ${activeTab === section.id 
                    ? 'bg-white text-[#3a3839] shadow-md' 
                    : 'bg-gray-700 text-[#C4C4C4] hover:bg-gray-600'
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Tab Content - 2 columns grid */}
          <div className="min-h-[50px]">
            {footerData.sections.map((section) => (
              <div
                key={section.id}
                className={`
                  ${activeTab === section.id ? 'block' : 'hidden'}
                  animate-fadeIn
                `}
              >
                <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-[#C4C4C4] hover:text-white text-sm sm:text-base transition-colors duration-200 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-[#C4C4C4] rounded-full mr-2 flex-shrink-0 group-hover:bg-white transition-colors"></span>
                        <span className="line-clamp-1">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-6 lg:my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Copyright Text */}
          <p className="text-[#C4C4C4] text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
            {footerData.companyInfo.copyright}
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end order-1 sm:order-2">
            {footerData.paymentMethods.map((payment) => (
              <div 
                key={payment.id} 
                title={payment.name} 
                className="transition-transform hover:scale-105 duration-200"
              >
                {getPaymentIcon(payment.id, "w-12 h-8 sm:w-14 sm:h-9")}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar and animation */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </footer>
  );
};
