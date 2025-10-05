import React from 'react';
import { User } from '../types/profile.types';

export interface AccountOverviewProps {
  user: User;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({ user }) => {
  const displayName =user.username;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="px-6 py-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border border-white/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold">
            {initial}
          </div>
        )}
        <h1 className="text-2xl font-semibold">{displayName}</h1>
      </div>
    </div>
  );
};