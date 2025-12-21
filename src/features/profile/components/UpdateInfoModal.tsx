"use client";

import React from "react";
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileFormData } from "../types/profile.types";

// Update profile API payload interface
export interface UpdateProfileApiPayload {
  username?: string;
  dob?: string; // Date of birth in DD/MM/YYYY format (e.g., "12/10/2003")
  phone?: string;
}

interface UpdateInfoModalProps {
  isOpen: boolean;
  profileFormData: ProfileFormData;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
  onClose: () => void;
  onProfileFormDataChange: (data: Partial<ProfileFormData>) => void;
  onSubmit: (data: UpdateProfileApiPayload) => void;
}

export const UpdateInfoModal: React.FC<UpdateInfoModalProps> = ({
  isOpen,
  profileFormData,
  isUpdating,
  validationErrors,
  onClose,
  onProfileFormDataChange,
  onSubmit,
}) => {
  const { translations } = useLanguage();
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onProfileFormDataChange({
      [name]: value,
    });
  };

  // Convert date from YYYY-MM-DD to DD/MM/YYYY format
  const convertDateFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format data according to API specification
    const apiPayload: UpdateProfileApiPayload = {
      username: profileFormData.username,
      dob: convertDateFormat(profileFormData.dob || ''), // Convert dob to correct format
      phone: profileFormData.phone
    };
    
    onSubmit(apiPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl border border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
          disabled={isUpdating}
        >
          ×
        </button>

        {/* Modal title */}
        <h2 className="text-xl font-semibold text-black mb-6">
          {translations.profile.updateInformationTitle || 'Update Information'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
                {translations.profile.nameLabel || 'Name'}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileFormData.username || ""}
              onChange={handleInputChange}
              placeholder={translations.profile.nameLabel || 'Username'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              disabled={isUpdating}
            />
            {validationErrors.username && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Date of Birth field */}
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {translations.profile.dateOfBirthLabel || 'Date of Birth'}
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={profileFormData.dob || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              disabled={isUpdating}
            />
            {validationErrors.dob && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.dob}
              </p>
            )}
          </div>

          {/* Phone field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {translations.profile.phoneNumberLabel || 'Phone Number'}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileFormData.phone || ""}
              onChange={handleInputChange}
              placeholder={translations.profile.phoneNumberLabel || 'Phone number'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              disabled={isUpdating}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.phone}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-black text-white py-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none mt-6"
          >
            {isUpdating ? (translations.profile.updating || 'Updating...') : (translations.profile.updateButton || 'Update')}
          </button>
        </form>
      </div>
    </div>
  );
};
