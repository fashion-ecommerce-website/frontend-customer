'use client';

import { ProfileContainer } from '@/features/profile';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components';
import { useToast } from '@/providers/ToastProvider';

export default function ProfilePage() {
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
        onUpdateSuccess={(user) => {
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
