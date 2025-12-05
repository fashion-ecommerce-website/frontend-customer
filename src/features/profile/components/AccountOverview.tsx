import React from 'react';
import Image from 'next/image';
import { User } from '../types/profile.types';

export interface AccountOverviewProps {
  user: User;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({ user }) => {
  const displayName = user.username;

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-white border-b border-gray-200">
      {/* Avatar */}
      <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden bg-gray-100">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
            sizes="80px"
            onError={(e) => {
              // Hide the broken image and show fallback icon
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300';
                fallback.innerHTML = '<svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* User Name */}
      <h2 className="text-center text-base font-semibold text-gray-900 mb-1">
        {displayName}
      </h2>
      
      {/* Email */}
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
};