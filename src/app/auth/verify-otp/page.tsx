'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { VerifyOtpContainer } from '@/features/auth/verify-otp/containers/VerifyOtpContainer';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return <VerifyOtpContainer email={email} />;
}
