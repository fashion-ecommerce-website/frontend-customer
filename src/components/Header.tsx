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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  <header className="bg-white px-2 relative" onMouseLeave={() => setHoveredCat(null)}>
        <div className="sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[64px]">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-3xl font-black text-black tracking-tight"
              >
                FIT
              </Link>
            </div>

            {/* Navigation (categories from API) */}
            <div className="hidden md:block ml-12">
              {/* wrapper keeps nav + overlay panel together so mouseleave can hide the panel */}
              <div className="relative">
                <nav className="flex items-end space-x-8">
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
                          className="text-black hover:text-[#BB9244] text-[17px] px-1 py-2 text-base font-bold inline-block"
                        >
                          {cat.name.toUpperCase()}
                        </Link>
                      </div>
                    ))
                  ) : (
                    // fallback: single SHOP link if API empty/fails
                    <Link
                      href="/shop"
                      className="text-black text-[17px] px-1 py-2 text-base font-bold"
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
              <div className="flex-1 max-w-md mx-8 flex justify-center items-center">
                <svg
                  className="h-6 w-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  onClick={() => router.push("/search")}
                  style={{ minWidth: 24 }}
                >
                  <title>Search</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Link
                href="/cart"
                className="text-black relative"
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
                {/* Cart item count badge */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className="text-black relative cursor-pointer"
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
                  className="text-black flex items-center space-x-1"
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
                      className="hidden lg:inline-block h-4 w-4"
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

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-black p-2"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.slug)}`}
                      className="block px-3 py-3 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {cat.children && (
                      <div className="pl-4">
                        {cat.children.map((child) => (
                          <div key={child.id}>
                            <Link
                              href={`/products?category=${encodeURIComponent(child.slug)}`}
                              className="block px-3 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                            {child.children && child.children.map((g) => (
                              <Link
                                key={g.id}
                                href={`/products?category=${encodeURIComponent(g.slug)}`}
                                className="block px-3 py-1 text-sm text-gray-500 hover:text-black"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {g.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Link
                  href="/shop"
                  className="block px-3 py-3 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
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
                className="w-full text-left px-3 py-3 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
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

              {/* Cart button for mobile */}
              <Link
                href="/cart"
                className="w-full text-left px-3 py-3 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
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
                <span>Cart</span>
              </Link>
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 text-black placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Desktop overlay children panel - absolute so it sits above other content (z-index) */}
        <div className="hidden md:block">
          <div
            className={`absolute left-0 right-0 top-full z-50 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] transform ${hoveredCat ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
            style={{
              // pointer events enabled only when visible
              pointerEvents: hoveredCat ? 'auto' : 'none',
            }}
          >
            {/* full-bleed background to span entire viewport width */}
            <div className="w-full">
              <div className="bg-white px-[20em] py-6">
                {/* find hovered category data */}
                {hoveredCat && categories.find((c) => c.id === hoveredCat) ? (
                  (() => {
                    const cat = categories.find((c) => c.id === hoveredCat)!;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cat.children && cat.children.map((child) => (
                          <div key={child.id}>
                            <Link
                              href={`/products?category=${encodeURIComponent(child.slug)}`}
                              className="block text-sm font-bold text-black hover:text-[#BB9244] mb-2"
                            >
                              {child.name}
                            </Link>

                            {child.children && child.children.length > 0 && (
                              <ul className="text-sm text-black space-y-1">
                                {child.children.map((g) => (
                                  <li key={g.id}>
                                    <Link
                                      href={`/products?category=${encodeURIComponent(g.slug)}`}
                                      className="hover:text-[#BB9244]"
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
