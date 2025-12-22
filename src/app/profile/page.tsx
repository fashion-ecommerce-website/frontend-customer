'use client';

import React, { Suspense } from 'react';
import { ProfileContainer } from '@/features/profile';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components';
import { useToast } from '@/providers/ToastProvider';
import { useLanguage } from '@/hooks/useLanguage';

function ProfileContent() {
  const { showSuccess, showError } = useToast();
  const { translations } = useLanguage();
  const t = translations.toast;
  const params = useSearchParams();
  const sectionParam = params.get('section');
  const tabParam = params.get('tab');
  const initialSection = sectionParam || (
    tabParam === 'wishlist' ? 'wishlist'
    : tabParam === 'recently' ? 'recently-viewed'
    : tabParam === 'addresses' ? 'shipping-address'
    : tabParam === 'vouchers' ? 'my-vouchers'
    : tabParam ? 'account'
    : undefined
  );
  return (
    <AuthGuard>
      <ProfileContainer
        initialSection={initialSection}
        onUpdateSuccess={() => {
          showSuccess(t.profileUpdatedSuccess);
        }}
        onUpdateError={(error) => {
          showError(error.message || t.profileUpdateFailed);
        }}
        onPasswordChangeSuccess={() => {
          showSuccess(t.passwordChangedSuccess);
        }}
        onPasswordChangeError={(error) => {
          showError(error.message || t.passwordChangeFailed);
        }}
      />
    </AuthGuard>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
