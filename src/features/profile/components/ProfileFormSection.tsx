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
  onShowUpdateInfoModal: () => void;
  isChangingPassword: boolean;
}

export const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  user,
  profileFormData,
  onShowPasswordModal,
  onShowUpdateInfoModal,
  isChangingPassword,
}) => {

  return (
    <div className="space-y-6">
      {/* Account Login Section */}
      <section className="bg-white">
        <h3 className="text-lg sm:text-xl w-full font-semibold pb-2 text-black border-b-2 border-black mb-4">ACCOUNT LOGIN</h3>
        
        {/* Username row */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-1 sm:gap-0">
          <div className="w-full sm:w-[220px] text-xs sm:text-sm font-medium text-gray-700 sm:text-black">Username</div>
          <div className="text-black text-sm sm:text-base break-all">{user.email}</div>
        </div>
        
        {/* Change password button */}
        <div className="sm:ml-[220px]">
          <button 
            className="w-full sm:w-auto bg-white text-black border border-gray-300 rounded px-4 sm:px-3 py-2.5 sm:py-3 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onShowPasswordModal}
            disabled={isChangingPassword}
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Account Information Section */}
      <section className="bg-white pt-6 border-t border-gray-200">
        <h3 className="text-lg sm:text-xl w-full pb-2 font-semibold text-black border-b-2 border-black mb-4 sm:mb-6">ACCOUNT</h3>

        <div className="space-y-3 sm:space-y-1">
          {[
            { label: 'Name', htmlFor: 'username', value: profileFormData.username, className: 'flex-1 py-1 sm:py-2 text-black text-sm sm:text-base' },
            { label: 'Birthday', id: 'dob', value: profileFormData.dob, className: 'flex-1 py-1 sm:py-2 text-black text-sm sm:text-base' },
            // { label: 'Gender', htmlFor: 'gender', value: profileFormData.gender, className: 'flex-1 py-2 text-black' },
            { label: 'Phone', htmlFor: 'phone', value: profileFormData.phone, className: 'flex-1 py-1 sm:py-2 text-black text-sm sm:text-base' },
          ].map((field) => (
            <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="w-full sm:w-[220px] text-xs sm:text-sm font-medium text-gray-700 sm:text-black">{field.label}</div>
              <label
                htmlFor={field.htmlFor}
                id={field.id}
                className={field.className}
              >
                {field.value || '\u00A0'}
              </label>
            </div>
          ))}

          <div className="pt-2 sm:pt-0 sm:ml-[220px]">
            <button
              type="button"
              onClick={onShowUpdateInfoModal}
              className="w-full sm:w-auto bg-black text-white border-none rounded px-6 py-2.5 sm:py-3 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-800 focus:outline-none"
            >
              Update information
            </button>
          </div>
        </div>
      </section>

      {/* Email Section */}
      <section className="bg-white pt-6 border-t border-gray-200">
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Email *</div>
        <label
          className="block w-full max-w-md px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base bg-gray-50 cursor-not-allowed text-black break-all"
        >
          {user.email}
        </label>
      </section>
    </div>
  );
};
