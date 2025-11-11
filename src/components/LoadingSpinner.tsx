
'use client';

import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = '',
  message
}) => {
  return (
    <div className={`px-4 py-8 flex flex-col items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export const PageLoadingSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <LoadingSpinner message={message} />
    </div>
  );
};
