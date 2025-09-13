'use client';

import React from 'react';

export interface VerifyOtpPresenterProps {
  email: string;
  otpCode: string;
  isLoading: boolean;
  onOtpChange: (value: string) => void;
  onSubmit: () => void;
}

export const VerifyOtpPresenter: React.FC<VerifyOtpPresenterProps> = ({
  email,
  otpCode,
  isLoading,
  onOtpChange,
  onSubmit,
}) => {
  return (
    <div className="py-32 flex items-center justify-center bg-white">
      <div className="bg-white w-[430px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black tracking-wider">Verify OTP</h2>
          <p className="text-black text-sm">
            We have sent a verification code to <strong>{email}</strong>
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-6 w-full"
        >
          {/* OTP digit inputs */}
          <div className="flex gap-2 justify-center">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpCode[idx] || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (!val) return;
                  const newArr = Array.from({ length: 6 }, (_, i) => otpCode[i] || '');
                  newArr[idx] = val.charAt(0);
                  onOtpChange(newArr.join(''));
                  // focus next
                  const next = (e.target as HTMLInputElement).nextElementSibling as HTMLInputElement;
                  next?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otpCode[idx]) {
                    const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                    prev?.focus();
                  }
                }}
                disabled={isLoading}
                className="w-12 h-12 text-center border-2 border-gray-400 rounded text-black font-bold"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white py-3 rounded disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};
