'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerifyOtpContainer } from '@/features/auth/verify-otp/containers/VerifyOtpContainer';

function VerifyOtpPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return <VerifyOtpContainer email={email} />;
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}
