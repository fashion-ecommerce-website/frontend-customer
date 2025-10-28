import React from 'react';
import { User } from '../types/profile.types';

export interface AccountOverviewProps {
  user: User;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({ user }) => {
  const displayName =user.username;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg">
      <div className="flex items-center gap-3 sm:gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/30 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black bg-opacity-20 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
            {initial}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold truncate">{displayName}</h1>
      </div>
    </div>
  );
};