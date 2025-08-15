'use client';

// Home Presenter Component
// Presentational component for home page UI

import React, { useState } from 'react';
import Link from 'next/link';
import { HomePresenterProps } from '../types/home.types';
import { getSocialIcon, getPaymentIcon } from './Icons';
import { Banner } from './Banner';
import { ProductSection } from './ProductSection';
import { RecentlyViewed } from './RecentlyViewed';
import { mockRecentlyViewed } from '../data/mockData';

export const HomePresenter: React.FC<HomePresenterProps> = ({
  navigation,
  search,
  footer,
  banners,
  newArrivals,
  recommendedProducts,
  productCategories,
  isLoading,
  error,
  onNavigationItemClick,
  onMenuToggle,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onClearError,
  onProductClick,
  onCategoryClick,
  onBannerClick,
}) => {
  const [searchQuery, setSearchQuery] = useState(search.query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onSearchClear();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Promotional Banner */}
      <div className="bg-black text-white text-center py-2 px-4 relative">
        <p className="text-sm">
          Sign up and get 20% off to your first order.{' '}
          <Link href="/auth/register" className="underline font-medium hover:text-gray-200">
            Sign Up Now
          </Link>
        </p>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-lg"
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-3xl font-black text-black tracking-tight">
                FIT
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 ml-12">
              {navigation.items.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => onNavigationItemClick(item.id)}
                    className={`text-gray-900 hover:text-black px-1 py-2 text-base font-normal transition-colors flex items-center ${
                      item.isActive ? 'text-black font-medium' : ''
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.id}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-6">
              <Link href="/cart" className="text-gray-700 hover:text-black transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-black transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={onMenuToggle}
                className="text-gray-700 hover:text-black p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {navigation.isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigation.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block px-3 py-3 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => onNavigationItemClick(item.id)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={onClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Banner Section */}
            <Banner
              banners={banners}
              onBannerClick={onBannerClick}
            />

            {/* New Arrivals Section */}
            <ProductSection
              title="New arrival"
              products={newArrivals}
              categories={productCategories}
              onProductClick={onProductClick}
              onCategoryClick={onCategoryClick}
              showCategories={true}
            />

            {/* Recommended Products Section */}
            <ProductSection
              title="PRODUCT YOU MIGHT LIKE"
              products={recommendedProducts}
              onProductClick={onProductClick}
            />

            {/* Recently Viewed Section */}
            <RecentlyViewed
              products={mockRecentlyViewed}
              onProductClick={onProductClick}
              onEdit={() => console.log('Edit recently viewed')}
              onDeleteAll={() => console.log('Delete all recently viewed')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-black mb-4">{footer.companyInfo.name}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {footer.companyInfo.description}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {footer.socialLinks.map((social) => (
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
            {footer.sections.map((section) => (
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
              {footer.companyInfo.copyright}
            </p>
            
            {/* Payment Methods */}
            <div className="flex flex-wrap gap-2">
              {footer.paymentMethods.map((payment) => (
                <div key={payment.id} title={payment.name}>
                  {getPaymentIcon(payment.id, "w-12 h-8")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
