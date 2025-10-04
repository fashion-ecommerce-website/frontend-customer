"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/hooks/redux";
import { selectCartItemCount } from "@/features/cart/redux/cartSlice";
import { PromotionalBanner } from "./PromotionalBanner";
import { useCategories } from '@/hooks/useCategories';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Get authentication state from custom hook
  const { isAuthenticated, user, logout } = useAuth();
  
  // Get cart item count from Redux store
  const cartItemCount = useAppSelector(selectCartItemCount);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

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
      router.push("/auth/login?returnUrl=/profile");
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
  <header className="bg-white px-2 sticky top-0 z-50 shadow-sm mobile-header-shadow" onMouseLeave={() => setHoveredCat(null)}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Mobile Header Layout */}
          <div className="lg:hidden flex items-center justify-between min-h-[56px] py-1">
            {/* Left side - Menu + Search */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-black transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle mobile menu"
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
                className="text-black hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Search"
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
                className="text-xl font-black text-black tracking-tight"
              >
                FIT
              </Link>
            </div>

            {/* Right side - Cart + User */}
            <div className="flex items-center space-x-1 relative z-10">
              <Link
                href="/cart"
                className="text-black relative hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Shopping Cart"
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
                  <span className="absolute -top-0 -right-0 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleProfileClick}
                  className="text-black hover:text-gray-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center relative z-10"
                  aria-label="Profile"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 sm:w-52 mobile-dropdown lg:shadow-lg">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Header Layout */}
          <div className="hidden lg:flex items-center justify-between min-h-[64px]">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl sm:text-3xl font-black text-black tracking-tight"
              >
                FIT
              </Link>
            </div>

            {/* Navigation (categories from API) */}
            <div className="ml-6 xl:ml-12">
              {/* wrapper keeps nav + overlay panel together so mouseleave can hide the panel */}
              <div className="relative">
                <nav className="flex items-end space-x-4 xl:space-x-8">
                  {categoriesLoading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      // hover sets hoveredCat; wrapper onMouseLeave clears it
                      <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredCat(cat.id)}
                      >
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          className="text-black hover:text-[#BB9244] text-sm lg:text-base xl:text-[17px] px-1 py-2 font-bold inline-block transition-colors"
                        >
                          {cat.name.toUpperCase()}
                        </Link>
                      </div>
                    ))
                  ) : (
                    // fallback: single SHOP link if API empty/fails
                    <Link
                      href="/shop"
                      className="text-black text-sm lg:text-base xl:text-[17px] px-1 py-2 font-bold"
                    >
                      SHOP
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <button
                onClick={() => router.push("/search")}
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Search"
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
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="text-black relative hover:text-gray-600 transition-colors"
                aria-label="Shopping Cart"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className="text-black relative cursor-pointer hover:text-gray-600 transition-colors"
                title={isAuthenticated ? "Wishlist" : "Login to view wishlist"}
                aria-label="Wishlist"
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
                    strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.682 4.318 12.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </button>
                
              {/* Profile/Login Button with Authentication Check */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleProfileClick}
                  className="text-black flex items-center space-x-1 hover:text-gray-600 transition-colors"
                  title={
                    isAuthenticated
                      ? `Profile (${user?.username || "User"})`
                      : "Login to access profile"
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
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
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
                  categories.map((cat) => (
                    <div key={cat.id} className="border-b border-gray-50 last:border-b-0">
                      <Link
                        href={`/products?category=${encodeURIComponent(cat.slug)}`}
                        className="block px-4 py-3 text-base font-semibold text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {cat.children && cat.children.length > 0 && (
                        <div className="ml-4 pb-2">
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
                  ))
                ) : (
                  <Link
                    href="/shop"
                    className="block px-4 py-3 text-base font-semibold text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SHOP
                  </Link>
                )}

                {/* Mobile Profile/Login Button */}
                <button
                  onClick={(e) => {
                    handleProfileClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
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
                  <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
                </button>

                {/* Wishlist button for mobile - only show on xs and up */}
                <button
                  onClick={handleWishlistClick}
                  className="xs:hidden w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
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
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop overlay children panel - absolute so it sits above other content (z-index) */}
        <div className="hidden lg:block">
          <div
            className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] transform ${hoveredCat ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
            style={{
              // pointer events enabled only when visible
              pointerEvents: hoveredCat ? 'auto' : 'none',
            }}
          >
            {/* full-bleed background to span entire viewport width */}
            <div className="w-full shadow-lg">
              <div className="bg-white px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-[20em] py-6">
                {/* find hovered category data */}
                {hoveredCat && categories.find((c) => c.id === hoveredCat) ? (
                  (() => {
                    const cat = categories.find((c) => c.id === hoveredCat)!;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cat.children && cat.children.map((child) => (
                          <div key={child.id}>
                            <Link
                              href={`/products?category=${encodeURIComponent(child.slug)}`}
                              className="block text-sm font-bold text-black hover:text-[#BB9244] mb-2 transition-colors"
                            >
                              {child.name}
                            </Link>

                            {child.children && child.children.length > 0 && (
                              <ul className="text-sm text-black space-y-1">
                                {child.children.map((g) => (
                                  <li key={g.id}>
                                    <Link
                                      href={`/products?category=${encodeURIComponent(g.slug)}`}
                                      className="hover:text-[#BB9244] transition-colors"
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
