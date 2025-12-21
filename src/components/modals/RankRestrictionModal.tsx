"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export const RankRestrictionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    // default behaviour: send user back to cart
    router.push('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-black">Feature Unavailable</h3>
        <p className="mb-4 text-black">Only Platinum or Diamond members can use Virtual Try-On. Please upgrade your membership to access this feature.</p>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-black rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
