'use client';

import React, { Suspense } from 'react';
import { ProfileContainer } from '@/features/profile';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components';
import { useToast } from '@/providers/ToastProvider';

function ProfileContent() {
  const { showSuccess, showError } = useToast();
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
          showSuccess('Profile updated successfully');
        }}
        onUpdateError={(error) => {
          showError(error.message || 'Failed to update profile');
        }}
        onPasswordChangeSuccess={() => {
          showSuccess('Password changed successfully');
        }}
        onPasswordChangeError={(error) => {
          showError(error.message || 'Failed to change password');
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
