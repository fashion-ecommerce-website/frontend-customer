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
            className="bg-white text-black border border-gray-300 rounded ml-[220px] px-3 py-3 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="space-y-1">
          {[
            { label: 'Name', htmlFor: 'username', value: profileFormData.username, className: 'flex-1 py-2 text-black' },
            { label: 'Birthday', id: 'dob', value: profileFormData.dob, className: 'flex-1 py-2 text-black' },
            // { label: 'Gender', htmlFor: 'gender', value: profileFormData.gender, className: 'flex-1 py-2 text-black' },
            { label: 'Phone', htmlFor: 'phone', value: profileFormData.phone, className: 'flex-1 py-2 text-black' },
          ].map((field) => (
            <div key={field.label} className="flex items-center">
              <div className="w-[220px] text-sm font-medium text-black">{field.label}</div>
              <label
                htmlFor={field.htmlFor}
                id={field.id}
                className={field.className}
              >
                {field.value || '\u00A0'}
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={onShowUpdateInfoModal}
            className="bg-black text-white ml-[220px] border-none rounded px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-800 focus:outline-none"
          >
            Update information
          </button>
        </div>
      </section>

      {/* Email Section */}
      <section className="px-6 py-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Email *</div>
        <label
          className="w-full max-w-md px-3 py-3 rounded-md text-base bg-gray-50 cursor-not-allowed text-black"
        >
          {user.email}
        </label>
      </section>
    </main>
  );
};
