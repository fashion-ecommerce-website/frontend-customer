"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/hooks/redux";
import { selectCartUniqueItemCount } from "@/features/cart/redux/cartSlice";
import { PromotionalBanner } from "./PromotionalBanner";
import { useCategories } from '@/hooks/useCategories';
import useLanguage from '@/hooks/useLanguage';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const router = useRouter();
  const userMenuRefMobile = useRef<HTMLDivElement>(null);
  const userMenuRefDesktop = useRef<HTMLDivElement>(null);

  const { categories, loading: categoriesLoading } = useCategories();

  const { lang, setLang, translations } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get authentication state from custom hook
  const { isAuthenticated, user, logout } = useAuth();
  
  // Get cart item count from Redux store (number of unique items)
  const cartItemCount = useAppSelector(selectCartUniqueItemCount);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideMobile = userMenuRefMobile.current && userMenuRefMobile.current.contains(target);
      const insideDesktop = userMenuRefDesktop.current && userMenuRefDesktop.current.contains(target);
      if (!insideMobile && !insideDesktop) {
        setIsUserMenuOpen(false);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const target = event.target as Node;
      const insideMobile = userMenuRefMobile.current && userMenuRefMobile.current.contains(target);
      const insideDesktop = userMenuRefDesktop.current && userMenuRefDesktop.current.contains(target);
      if (!insideMobile && !insideDesktop) {
        setIsUserMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isUserMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.classList.add('mobile-menu-open');
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
    };
  }, [isMenuOpen]);

  // categories are loaded by useCategories hook

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close user menu when mobile menu opens
    if (!isMenuOpen && isUserMenuOpen) {
      setIsUserMenuOpen(false);
    }
  };

  // Handle wishlist navigation
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated && user) {
      router.push("/profile?tab=wishlist");
    } else {
      router.push("/auth/login?returnUrl=/profile?tab=wishlist");
    }
  };

  // Handle profile/login navigation
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAuthenticated && user) {
      // Toggle user menu dropdown
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      // User is not logged in, redirect to login with return URL
      router.push("/auth/login?returnUrl=/");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // navigation now driven by `categories` fetched from API

  return (
    <>
      {/* Promotional Banner - Smart with auto-sliding */}
      <PromotionalBanner isAuthenticated={isAuthenticated} />

  {/* Header */}
  <header className="bg-white/90 backdrop-blur-md px-2 sticky top-0 z-50 border-b border-neutral-100/80 shadow-xs" onMouseLeave={() => setHoveredCat(null)}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Mobile Header Layout */}
          <div className="lg:hidden flex items-center justify-between min-h-[56px] py-1">
            {/* Left side - Menu + Search */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-black transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label={translations.header.menu}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
              
              <button
                onClick={() => router.push("/search")}
                className="text-black hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label={translations.header.search}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-serif-luxury text-2xl font-normal text-neutral-900 tracking-[0.25em]"
              >
                FIT
              </Link>
            </div>

            {/* Right side - Cart + User */}
            <div className="flex items-center space-x-1 relative z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLang(lang === 'en' ? 'vi' : 'en');
                }}
                className="text-black hover:text-gray-600 transition-colors flex items-center justify-center text-xs font-medium cursor-pointer"
                style={{ width: 44, height: 36, minWidth: 44 }}
                aria-label={translations.header.switchLanguage}
                title={mounted ? translations.header.switchLanguage : 'Switch language'}
              >
                {mounted ? lang.toUpperCase() : 'EN'}
              </button>
              <Link
                href="/cart"
                className="text-black relative hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={translations.header.cart}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon Mobile */}
              <div className="relative" ref={userMenuRefMobile}>
                <button
                  onClick={handleProfileClick}
                  className="text-black hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={translations.header.profile}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {/* Mobile User Dropdown Menu */}
                {isAuthenticated && isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-100 sm:w-52 mobile-dropdown lg:shadow-lg">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {translations.header.myProfile}
                      </Link>
                      <Link
                        href="/profile?section=order-info"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {translations.header.myOrders}
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                      >
                        {translations.header.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Header Layout */}
          <div className="hidden lg:flex items-center justify-between min-h-[72px]">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-serif-luxury text-3xl font-normal text-neutral-900 tracking-[0.25em] hover:text-amber-800 transition-colors"
              >
                FIT
              </Link>
            </div>

            {/* Navigation (categories from API) */}
            <div className="ml-4 xl:ml-12 flex-1 min-w-0 overflow-x-auto hide-scrollbar py-2">
              {/* wrapper keeps nav + overlay panel together so mouseleave can hide the panel */}
              <div className="relative">
                <nav className="flex items-center space-x-5 xl:space-x-8">
                  {categoriesLoading ? (
                    <div className="text-xs text-neutral-400 font-medium tracking-wider">Đang tải...</div>
                  ) : categories.length > 0 ? (
                    <>
                      {categories.map((cat) => (
                        // hover sets hoveredCat; wrapper onMouseLeave clears it
                        <div
                          key={cat.id}
                          onMouseEnter={() => setHoveredCat(cat.id)}
                        >
                          <Link
                            href={`/products?category=${encodeURIComponent(cat.slug)}`}
                            className="text-xs xl:text-[13px] font-semibold uppercase tracking-[0.15em] text-neutral-800 hover:text-[#C5A880] py-2 transition-colors inline-block whitespace-nowrap cursor-pointer relative group/item"
                          >
                            {cat.name}
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880] scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left" />
                          </Link>
                        </div>
                      ))}
                      {/* Sale link */}
                      <div onMouseEnter={() => setHoveredCat(null)}>
                        <Link
                          href="/sale"
                          className="text-xs xl:text-[13px] font-bold uppercase tracking-[0.15em] text-rose-600 hover:text-rose-700 py-2 inline-block transition-colors whitespace-nowrap"
                        >
                          {translations.header.sale}
                        </Link>
                      </div>
                    </>
                  ) : (
                    // fallback: single SHOP link if API empty/fails
                    <Link
                      href="/shop"
                      className="text-xs xl:text-[13px] font-semibold uppercase tracking-[0.15em] text-neutral-800 hover:text-[#C5A880]"
                    >
                      {translations.header.shop}
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 xl:space-x-6 flex-shrink-0 ml-4 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLang(lang === 'en' ? 'vi' : 'en');
                }}
                className="text-[11px] font-bold tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-950 hover:text-[#C5A880] px-3 py-1 rounded-full transition-all cursor-pointer border border-neutral-200"
                aria-label={translations.header.switchLanguage}
                title={mounted ? translations.header.switchLanguage : 'Switch language'}
              >
                {mounted ? lang.toUpperCase() : 'EN'}
              </button>

              {/* Search Bar */}
              <button
                onClick={() => router.push("/search")}
                className="text-neutral-800 hover:text-[#C5A880] transition-colors cursor-pointer p-1"
                aria-label={translations.header.search}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="text-neutral-800 relative hover:text-[#C5A880] transition-colors p-1"
                aria-label={translations.header.cart}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 text-[#C5A880] text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-amber-500/30 shadow-xs">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className="text-neutral-800 relative cursor-pointer hover:text-[#C5A880] transition-colors p-1"
                title={isAuthenticated ? translations.header.wishlist : translations.header.login}
                aria-label={translations.header.wishlist}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.682 4.318 12.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </button>
                
              {/* Profile/Login Button */}
              <div className="relative" ref={userMenuRefDesktop}>
                <button
                  onClick={handleProfileClick}
                  className="text-neutral-800 flex items-center space-x-1 hover:text-[#C5A880] transition-colors cursor-pointer p-1"
                  title={
                    isAuthenticated
                      ? `${translations.header.profile} (${user?.username || "User"})`
                      : translations.header.login
                  }
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {/* Dropdown arrow if authenticated */}
                  {isAuthenticated && (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {isAuthenticated && isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {translations.header.myProfile}
                      </Link>
                      <Link
                        href="/profile?section=order-info"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {translations.header.myOrders}
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {translations.header.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div className={`lg:hidden transition-all duration-300 ease-in-out relative z-40 ${isMenuOpen ? 'max-h-screen' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div 
            className="bg-white border-t border-gray-100"
            onTouchMove={(e) => {
              // Prevent touch events from bubbling up to body
              e.stopPropagation();
            }}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 max-h-[70vh] overflow-y-auto overscroll-contain mobile-menu-scroll">
              {/* Categories */}
              <div className="space-y-1">
                {categories.length > 0 ? (
                  <>
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <a
                          className="text-black hover:text-[#BB9244] text-sm lg:text-base xl:text-[17px] px-1 py-2 font-bold inline-block transition-colors cursor-default"
                        >
                          {cat.name.toUpperCase()}
                        </a>
                        {cat.children && cat.children.length > 0 && (
                          <div className="ml-4 pb-2">
                            {/* Child categories are always clickable */}
                            {cat.children.map((child) => (
                              <div key={child.id}>
                                <Link
                                  href={`/products?category=${encodeURIComponent(child.slug)}`}
                                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                                {child.children && child.children.length > 0 && (
                                  <div className="ml-4">
                                    {child.children.map((g) => (
                                      <Link
                                        key={g.id}
                                        href={`/products?category=${encodeURIComponent(g.slug)}`}
                                        className="block px-4 py-1 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {g.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Sale link for mobile */}
                    <div className="border-t border-gray-100 pt-2 mt-2">
                      <Link
                        href="/sale"
                        className="block px-4 py-3 text-base font-semibold text-red-600 hover:text-red-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🔥 {translations.header.sale}
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/shop"
                    className="block px-4 py-3 text-base font-semibold text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {translations.header.shop}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop overlay children panel - absolute so it sits above other content (z-index) */}
        <div className="hidden lg:block">
          <div
            className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] transform ${
              hoveredCat ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
            style={{
              pointerEvents: hoveredCat ? 'auto' : 'none',
            }}
          >
            {/* Full-bleed glassmorphic dark container */}
            <div className="w-full bg-neutral-950/95 backdrop-blur-xl border-b border-[#C5A880]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
                {/* find hovered category data */}
                {hoveredCat && categories.find((c) => c.id === hoveredCat) ? (
                  (() => {
                    const cat = categories.find((c) => c.id === hoveredCat)!;
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
                        {/* Subcategory Grid - Spans 3 Columns */}
                        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {cat.children && cat.children.map((child) => (
                            <div key={child.id} className="group">
                              <Link
                                href={`/products?category=${encodeURIComponent(child.slug)}`}
                                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-[#C5A880]/60 transition-all duration-300 cursor-pointer shadow-sm group-hover:scale-[1.02]"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[#C5A880] text-xs font-serif italic group-hover:rotate-45 transition-transform duration-300">✦</span>
                                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200 group-hover:text-[#C5A880] transition-colors">
                                    {child.name}
                                  </span>
                                </div>
                                <svg className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>

                              {child.children && child.children.length > 0 && (
                                <ul className="mt-2 ml-4 space-y-1.5 border-l border-neutral-800 pl-3">
                                  {child.children.map((g) => (
                                    <li key={g.id}>
                                      <Link
                                        href={`/products?category=${encodeURIComponent(g.slug)}`}
                                        className="text-xs text-neutral-400 hover:text-[#C5A880] transition-colors block py-0.5"
                                      >
                                        {g.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Right Featured Highlight Box */}
                        <div className="hidden lg:flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-[#C5A880]/30 relative overflow-hidden group shadow-lg">
                          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-2xl group-hover:bg-[#C5A880]/20 transition-all duration-500" />
                          
                          <div className="relative z-10 space-y-3">
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-1 rounded-full border border-[#C5A880]/20">
                              HAUTE SELECTION
                            </span>
                            <h4 className="font-serif-luxury text-xl text-white font-normal leading-snug">
                              {cat.name}
                            </h4>
                            <p className="text-xs text-neutral-400 font-light leading-relaxed">
                              Discover handcrafted luxury designs, premium materials, and iconic silhouettes.
                            </p>
                          </div>

                          <div className="relative z-10 pt-4">
                            <Link
                              href={`/products?category=${encodeURIComponent(cat.slug)}`}
                              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest text-neutral-950 uppercase bg-[#C5A880] hover:bg-[#B89762] rounded-full transition-all shadow-md cursor-pointer"
                            >
                              <span>BROWSE ALL</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
