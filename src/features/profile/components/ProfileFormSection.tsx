/**
 * Profile Form Section Component
 * Form for updating profile information
 */

'use client';

import React from 'react';
import { ProfileFormData } from '../types/profile.types';

interface ProfileFormSectionProps {
  user: {
    email: string;
  };
  profileFormData: ProfileFormData;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
  onProfileFormDataChange: (data: Partial<ProfileFormData>) => void;
  onSubmit: (data: ProfileFormData) => void;
  onInputFocus: () => void;
  onShowPasswordModal: () => void;
  isChangingPassword: boolean;
}

export const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  user,
  profileFormData,
  isUpdating,
  validationErrors,
  onProfileFormDataChange,
  onSubmit,
  onInputFocus,
  onShowPasswordModal,
  isChangingPassword,
}) => {
  // Handle profile input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onProfileFormDataChange({
      [name]: value,
    });
  };

  // Handle profile form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profileFormData);
  };

  return (
    <main className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Account Login Section */}
      <section className="px-6 py-6 bg-white">
        <h3 className="text-xl w-full font-semibold pb-2 text-black border-b-2 border-black mb-4">ACCOUNT LOGIN</h3>
        
        {/* Username row */}
        <div className="flex items-center mb-4">
          <div className="w-[220px] text-sm font-medium text-black">Username</div>
          <div className="text-black">{user.email}</div>
        </div>
        
        {/* Change password button */}
        <div>
          <button 
            className="bg-white text-black border border-gray-300 rounded ml-[220px] px-3 py-4 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onShowPasswordModal}
            disabled={isChangingPassword}
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Account Information Section */}
      <section className="px-6 pb-6 bg-white">
        <h3 className="text-xl w-full pb-2 font-semibold text-black border-b-2 border-black mb-6">ACCOUNT</h3>

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Name row */}
          <div className="flex items-center">
            <div className="w-[220px] text-sm font-medium text-black">Name</div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileFormData.firstName}
              onChange={handleInputChange}
              onFocus={onInputFocus}
              placeholder="Phuc Le"
              className="flex-1 px-3 py-2 text-base bg-transparent focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-black"
              disabled={isUpdating}
            />
            {validationErrors.firstName && (
              <span className="text-sm text-red-800 ml-2">{validationErrors.firstName}</span>
            )}
          </div>

          {/* Birthday row */}
          <div className="flex items-center">
            <div className="w-[220px] text-sm font-medium text-black">Birthday</div>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={profileFormData.dateOfBirth}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 text-base bg-transparent focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-black"
              disabled={isUpdating}
            />
          </div>

          {/* Gender row */}
          <div className="flex items-center">
            <div className="w-[220px] text-sm font-medium text-black">Gender</div>
            <select
              id="gender"
              name="gender"
              value={profileFormData.gender}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 text-base bg-transparent cursor-pointer focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-black"
              disabled={isUpdating}
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone row */}
          <div className="flex items-center">
            <div className="w-[220px] text-sm font-medium text-black">Phone</div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileFormData.phone}
              onChange={handleInputChange}
              placeholder=""
              className="flex-1 px-3 py-2 text-base bg-transparent focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-black"
              disabled={isUpdating}
            />
            {validationErrors.phone && (
              <span className="text-sm text-red-800 ml-2">{validationErrors.phone}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-black text-white ml-[220px] border-none rounded px-6 py-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {isUpdating ? 'Updating...' : 'Update information'}
          </button>
        </form>
      </section>

      {/* Email Section */}
      <section className="px-6 py-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Email *</div>
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full max-w-md px-3 py-3 rounded-md text-base bg-gray-50 cursor-not-allowed text-black"
        />
      </section>
    </main>
  );
};
