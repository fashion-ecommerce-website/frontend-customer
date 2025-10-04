"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegisterPresenterProps } from "../types/register.types";
import { GoogleAuth } from "../../../../components";

export const RegisterPresenter: React.FC<RegisterPresenterProps> = ({
  isLoading,
  formData,
  onFormDataChange,
  onSubmit,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    onFormDataChange({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s|-/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(formData);
  };

  // Show register form
  return (
    <div className="py-8 flex items-center justify-center bg-white">
      <div className="bg-white w-[430px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black tracking-wider">
            REGISTER
          </h2>
          <p className="text-black text-sm mb-2 text-start">
            Register as a member and receive a 10% discount on your first order
          </p>
          <p className="text-black text-sm text-start">
            Enter code: <strong>FITWELCOME</strong>
          </p>
        </div>

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
              placeholder="Email"
              required
              disabled={isLoading}
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                validationErrors.email ? "border-red-500" : ""
              } ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
            {validationErrors.email && (
              <div className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="font-medium text-black mb-2 text-sm tracking-wider"
            >
              PHONE NUMBER
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
              disabled={isLoading}
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                validationErrors.phone ? "border-red-500" : ""
              } ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
            {validationErrors.phone && (
              <div className="text-red-500 text-xs mt-1">
                {validationErrors.phone}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="font-medium text-black mb-2 text-sm tracking-wider"
            >
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              disabled={isLoading}
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                validationErrors.username ? "border-red-500" : ""
              } ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
            {validationErrors.username && (
              <div className="text-red-500 text-xs mt-1">
                {validationErrors.username}
              </div>
            )}
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
              placeholder="Password"
              required
              disabled={isLoading}
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                validationErrors.password ? "border-red-500" : ""
              } ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
            {validationErrors.password && (
              <div className="text-red-500 text-xs mt-1">
                {validationErrors.password}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="font-medium text-black mb-2 text-sm tracking-wider"
            >
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
              disabled={isLoading}
              className={`px-4 py-3 h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-base text-black ${
                validationErrors.confirmPassword ? "border-red-500" : ""
              } ${
                isLoading ? "bg-gray-50 cursor-not-allowed opacity-50" : ""
              } placeholder-gray-400`}
            />
            {validationErrors.confirmPassword && (
              <div className="text-red-500 text-xs mt-1">
                {validationErrors.confirmPassword}
              </div>
            )}
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
            {isLoading ? "Creating Account..." : "REGISTER"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-900">Already have an account? </span>
            <Link href="/auth/login" className="text-gray-900 hover:underline">
              Sign in
            </Link>
          </div>

          <div className="mt-2">
            <GoogleAuth
              onSuccess={(user) => {
                // Remove success message - just log for debugging
                console.log("Google login successful:", user);
                // Don't show any toast message to avoid the green "logout" text
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-3 py-3 sm:py-4 px-6 bg-[#3B5998] text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 text-sm tracking-wider rounded"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
                <path
                  fill="currentColor"
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
