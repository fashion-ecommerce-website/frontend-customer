"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LoginPresenterProps } from "../types/login.types";
import { GoogleAuth } from "../../../../components";
import { useToast } from "../../../../providers/ToastProvider";

export const LoginPresenter: React.FC<LoginPresenterProps> = ({
  isLoading,
  error,
  formData,
  onFormDataChange,
  onSubmit,
  onClearError,
}) => {
  const { showError } = useToast();
  // Show toast on error prop change and clear error state
  useEffect(() => {
    if (error) {
      // Don't show error for user cancellation cases
      const isCancelledByUser =
        error.message.includes("đóng cửa sổ") ||
        error.message.includes("bị hủy") ||
        error.message.includes("cancelled") ||
        error.message.includes("popup-closed-by-user");

      if (!isCancelledByUser) {
        showError(error.message);
      }
      onClearError();
    }
  }, [error, showError, onClearError]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onFormDataChange({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Show login form
  return (
    <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 flex items-center justify-center bg-white min-h-[calc(100vh-80px)]">
      <div className="bg-white w-full max-w-[430px]">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 tracking-wider">
            LOGIN
          </h2>
          <p className="text-black text-sm sm:text-base mb-2 text-start">
            Register as a member and receive a 10% discount on your first order
          </p>
          <p className="text-black text-sm sm:text-base text-start">
            Enter code: <strong>FITWELCOME</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Email"
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400 focus:border-black focus:outline-none`}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Password"
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400 focus:border-black focus:outline-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black text-white py-3 sm:py-4 px-4 sm:px-6 h-[44px] sm:h-[48px] w-full font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 tracking-wider text-sm sm:text-base rounded ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
            )}
            {isLoading ? "Signing in..." : "LOGIN"}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-gray-900 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
            <span className="text-gray-500 mx-2">|</span>
            <Link
              href="/auth/register"
              className="text-gray-900 hover:underline transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="mt-2">
            <GoogleAuth/>
          </div>
        </form>
      </div>
    </div>
  );
};
