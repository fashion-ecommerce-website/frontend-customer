"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegisterPresenterProps } from "../types/register.types";
import { GoogleAuth } from "../../../../components";
import { useLanguage } from "@/hooks/useLanguage";

export const RegisterPresenter: React.FC<RegisterPresenterProps> = ({
  isLoading,
  formData,
  onFormDataChange,
  onSubmit,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { translations } = useLanguage();

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
      errors.phone = translations.auth.phoneRequired;
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s|-/g, ""))) {
      errors.phone = translations.auth.phoneInvalid;
    }

    if (!formData.username.trim()) {
      errors.username = translations.auth.usernameRequired;
    } else if (formData.username.length < 3) {
      errors.username = translations.auth.usernameMinLength;
    }

    if (!formData.email.trim()) {
      errors.email = translations.auth.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = translations.auth.emailInvalid;
    }

    if (!formData.password) {
      errors.password = translations.auth.passwordRequired;
    } else if (formData.password.length < 6) {
      errors.password = translations.auth.passwordMinLength;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = translations.auth.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = translations.auth.passwordsNotMatch;
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
    <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 flex items-center justify-center bg-white min-h-[calc(100vh-80px)]">
      <div className="bg-white w-full max-w-[430px]">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-wider">
            {translations.auth.register.toUpperCase()}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:gap-4 w-full"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              {translations.auth.email.toUpperCase()}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={translations.auth.email}
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
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
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              {translations.auth.phoneNumber.toUpperCase()}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={translations.auth.phoneNumber}
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
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
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              {translations.auth.username.toUpperCase()}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={translations.auth.username}
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
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
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              {translations.auth.password.toUpperCase()}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={translations.auth.password}
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
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
              className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider"
            >
              {translations.auth.confirmPassword.toUpperCase()}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={translations.auth.confirmPassword}
              required
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 h-[40px] sm:h-[44px] w-full box-border border-2 border-gray-300 rounded transition-all duration-200 bg-white text-sm sm:text-base text-black ${
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
            className={`bg-black text-white py-3 sm:py-4 px-4 sm:px-6 h-[44px] sm:h-[48px] w-full font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 tracking-wider text-sm sm:text-base rounded ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
            )}
            {isLoading ? translations.auth.creatingAccount : translations.auth.register.toUpperCase()}
          </button>

          <div className="text-center text-xs sm:text-sm">
            <span className="text-gray-900">{translations.auth.alreadyHaveAccount} </span>
            <Link
              href="/auth/login"
              className="text-gray-900 hover:underline font-medium"
            >
              {translations.auth.signIn}
            </Link>
          </div>

          <div className="mt-1 sm:mt-2">
            <GoogleAuth/>
          </div>
        </form>
      </div>
    </div>
  );
};
