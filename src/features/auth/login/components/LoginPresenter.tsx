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
  onLogout,
}) => {
  const { showSuccess, showError } = useToast();
  // Show toast on error prop change and clear error state
  useEffect(() => {
    if (error) {
      showError(error.message);
      onClearError();
    }
  }, [error]);

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
    <div className="py-16 flex items-center justify-center bg-white">
      <div className="bg-white w-[430px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4 tracking-wider">
            LOGIN
          </h2>
          <p className="text-black text-sm mb-2 text-start">
            Register as a member and receive a 10% discount on your first order
          </p>
          <p className="text-black text-sm text-start">
            Enter code: <strong>MLBWELCOME</strong>
          </p>
        </div>


        {/* Auth Status Display */}
        {/* <div className="mb-6">
          <GoogleAuth showFullStatus={true} hideLoginButton={true} />
        </div> */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[430px]">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-medium text-black mb-2 text-sm tracking-wider"
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
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-medium text-black mb-2 text-sm tracking-wider"
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
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black text-white py-4 px-6 h-[48px] w-full font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 tracking-wider text-base rounded ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            }`}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
            )}
            {isLoading ? "Signing in..." : "LOGIN"}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-gray-900 hover:underline"
            >
              Forgot password?
            </Link>
            <span className="text-gray-500 mx-2">|</span>
            <Link
              href="/auth/register"
              className="text-gray-900 hover:underline"
            >
              Register
            </Link>
          </div>

          <div>
            <GoogleAuth
              onSuccess={(user) => {
                showSuccess(
                  `Welcome ${user.name}! Login successfull.`
                );
                // TODO: Redirect to home or dashboard
                setTimeout(() => {
                  window.location.href = "/";
                }, 1500);
              }}
              onError={(error) => {
                showError(error);
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-3 py-4 px-6 bg-[#3B5998] text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 text-sm tracking-wider rounded"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              LOGIN FACEBOOK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
