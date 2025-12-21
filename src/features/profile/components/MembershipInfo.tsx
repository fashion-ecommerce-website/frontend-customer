'use client';

import React from 'react';
import { User } from '../types/profile.types';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  user: User;
}

export const MembershipInfo: React.FC<Props> = ({ user }) => {
  const { translations } = useLanguage();
  const rank = user.rankName && user.rankName.trim() !== '' ? user.rankName : 'N/A';

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-semibold mb-2">{translations.profile.membershipTier}</h2>
      <div className="mt-3 p-6 border border-gray-100 rounded-lg bg-gradient-to-r from-gray-50 to-white flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-black">
          {rank && rank !== 'N/A' ? rank.charAt(0) : '–'}
        </div>
        <div>
          <div className="text-lg font-semibold">{rank}</div>
          <div className="mt-1 text-sm text-black">Your membership tier and benefits.</div>
        </div>
      </div>
    </div>
  );
};

export default MembershipInfo;
