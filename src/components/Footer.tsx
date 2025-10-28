'use client';

import React, { useState } from 'react';
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
        <img src="https://www.svgrepo.com/show/506668/instagram.svg" alt="Instagram" className={className} />
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
          <img src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21~bgwhite.svg" alt="Stripe" className="w-full h-full object-contain" />
        </div>
      );
    case 'apple-pay':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 12" className="w-[28px] h-[12px]">
            <path d="M5.91984 2.08156C6.23083 1.69258 6.44187 1.17028 6.38621 0.636566C5.93096 0.659203 5.37542 0.936909 5.05379 1.3262C4.765 1.65956 4.50939 2.20372 4.57603 2.71507C5.08707 2.7594 5.59763 2.45963 5.91984 2.08156Z" fill="#000008"/>
            <path d="M6.38042 2.81491C5.63827 2.77071 5.00726 3.23612 4.65284 3.23612C4.29823 3.23612 3.75551 2.83719 3.1685 2.84794C2.40448 2.85917 1.69556 3.29115 1.30785 3.97821C0.510404 5.35266 1.09741 7.39146 1.87288 8.51087C2.24947 9.06468 2.70333 9.67447 3.30135 9.65256C3.86638 9.63039 4.08785 9.28669 4.77467 9.28669C5.46098 9.28669 5.66048 9.65256 6.2586 9.64148C6.87887 9.63039 7.26664 9.08739 7.64323 8.53304C8.07524 7.90173 8.2521 7.29214 8.26322 7.25868C8.2521 7.24759 7.06718 6.79303 7.05619 5.43C7.045 4.28871 7.98648 3.74586 8.03079 3.71219C7.49913 2.92586 6.66842 2.83719 6.38042 2.81491Z" fill="#000008"/>
            <path d="M12.8425 1.27037C14.4555 1.27037 15.5788 2.38227 15.5788 4.0011C15.5788 5.62572 14.4324 6.74339 12.802 6.74339H11.0161V9.58358H9.72572V1.27037L12.8425 1.27037ZM11.0161 5.66027H12.4967C13.6201 5.66027 14.2595 5.05543 14.2595 4.00688C14.2595 2.95844 13.6201 2.35926 12.5024 2.35926H11.0161V5.66027Z" fill="#000008"/>
            <path d="M15.9159 7.86105C15.9159 6.80093 16.7282 6.14998 18.1686 6.0693L19.8276 5.9714V5.5048C19.8276 4.83073 19.3725 4.42746 18.6122 4.42746C17.8919 4.42746 17.4425 4.77306 17.3331 5.31467H16.1579C16.227 4.22 17.1602 3.41347 18.6582 3.41347C20.1272 3.41347 21.0662 4.19122 21.0662 5.40679V9.58356H19.8736V8.5869H19.845C19.4936 9.26097 18.7273 9.68724 17.9323 9.68724C16.7455 9.68724 15.9159 8.94983 15.9159 7.86105ZM19.8276 7.31377V6.83561L18.3355 6.92773C17.5923 6.97962 17.1718 7.30799 17.1718 7.82649C17.1718 8.35643 17.6096 8.70213 18.2779 8.70213C19.1478 8.70213 19.8276 8.10296 19.8276 7.31377Z" fill="#000008"/>
            <path d="M22.1921 11.8131V10.8049C22.2841 10.8279 22.4915 10.8279 22.5952 10.8279C23.1713 10.8279 23.4824 10.586 23.6725 9.96382C23.6725 9.95226 23.782 9.59512 23.782 9.58934L21.5929 3.52292H22.9408L24.4734 8.45444H24.4963L26.0289 3.52292H27.3424L25.0724 9.90037C24.5541 11.3695 23.9549 11.8419 22.699 11.8419C22.5952 11.8419 22.2841 11.8303 22.1921 11.8131Z" fill="#000008"/>
          </svg>
        </div>
      );
    case 'google-pay':
      return (
        <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 13" className="w-[29px] h-[13px]">
            <path d="M13.751 9.61412H12.7026V1.45587H15.482C16.1865 1.45587 16.7871 1.69068 17.2786 2.1603C17.781 2.62991 18.0322 3.20329 18.0322 3.88041C18.0322 4.57391 17.781 5.14728 17.2786 5.61144C16.7926 6.0756 16.1919 6.30495 15.482 6.30495H13.751V9.61412ZM13.751 2.46063V5.30564H15.5039C15.9189 5.30564 16.2684 5.16367 16.5414 4.88517C16.8199 4.60668 16.9619 4.26812 16.9619 3.88587C16.9619 3.50908 16.8199 3.17598 16.5414 2.89749C16.2684 2.60807 15.9244 2.46609 15.5039 2.46609H13.751V2.46063Z" fill="#3C4043"/>
            <path d="M20.7733 3.84764C21.5487 3.84764 22.1603 4.05515 22.6081 4.47016C23.0559 4.88517 23.2797 5.45308 23.2797 6.17389V9.61412H22.2804V8.8387H22.2368C21.8054 9.4776 21.2265 9.79432 20.5057 9.79432C19.8887 9.79432 19.3754 9.61412 18.9604 9.24825C18.5454 8.88239 18.3379 8.42915 18.3379 7.88308C18.3379 7.30425 18.5563 6.84555 18.9931 6.50699C19.43 6.16297 20.0143 5.99369 20.7405 5.99369C21.3631 5.99369 21.8764 6.10836 22.275 6.33771V6.09744C22.275 5.73158 22.133 5.42578 21.8436 5.16913C21.5542 4.91247 21.2156 4.78688 20.8279 4.78688C20.2436 4.78688 19.7795 5.03261 19.4409 5.52953L18.5181 4.9507C19.0259 4.21351 19.7795 3.84764 20.7733 3.84764ZM19.4191 7.89946C19.4191 8.1725 19.5337 8.40185 19.7685 8.58205C19.9979 8.76225 20.2709 8.85508 20.5822 8.85508C21.0245 8.85508 21.4177 8.69126 21.7617 8.36362C22.1057 8.03598 22.2804 7.65374 22.2804 7.21142C21.9528 6.95477 21.4996 6.82371 20.9153 6.82371C20.4894 6.82371 20.1344 6.92747 19.8505 7.12951C19.561 7.34248 19.4191 7.59913 19.4191 7.89946Z" fill="#3C4043"/>
            <path d="M28.9807 4.0279L25.4859 12.066H24.4047L25.7043 9.25377L23.3999 4.0279H24.5412L26.2012 8.03603H26.2231L27.8394 4.0279H28.9807Z" fill="#3C4043"/>
            <path d="M9.58065 5.64421C9.58065 5.30237 9.55007 4.97528 9.49328 4.66074H5.09855V6.46277L7.62956 6.46331C7.5269 7.06289 7.19653 7.57401 6.69033 7.91476V9.08389H8.19692C9.07663 8.2697 9.58065 7.06617 9.58065 5.64421Z" fill="#4285F4"/>
            <path d="M6.69086 7.91481C6.27149 8.19768 5.73143 8.36314 5.09963 8.36314C3.87918 8.36314 2.84384 7.54076 2.47306 6.43224H0.918959V7.63796C1.68891 9.16586 3.27141 10.2143 5.09963 10.2143C6.36322 10.2143 7.42478 9.79875 8.19746 9.0834L6.69086 7.91481Z" fill="#34A853"/>
            <path d="M2.32667 5.53772C2.32667 5.22646 2.37854 4.92557 2.47301 4.64271V3.43699H0.918912C0.600556 4.06879 0.421448 4.78196 0.421448 5.53772C0.421448 6.29347 0.601102 7.00664 0.918912 7.63844L2.47301 6.43272C2.37854 6.14986 2.32667 5.84897 2.32667 5.53772Z" fill="#FABB05"/>
            <path d="M5.09963 2.71183C5.78931 2.71183 6.40691 2.94937 6.89455 3.41352L8.22967 2.07948C7.41877 1.32427 6.36159 0.860657 5.09963 0.860657C3.27195 0.860657 1.68886 1.9091 0.918912 3.43699L2.47301 4.64271C2.84379 3.53419 3.87918 2.71183 5.09963 2.71183Z" fill="#E94235"/>
          </svg>
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
