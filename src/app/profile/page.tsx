'use client';

import { ProfileContainer } from '@/features/profile';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components';

export default function ProfilePage() {
  const params = useSearchParams();
  const tab = params?.get('tab');
  const initialSection =
    tab === 'wishlist' ? 'wishlist'
    : tab === 'recently' ? 'recently-viewed'
    : tab === 'addresses' ? 'shipping-address'
    : 'account';

  return (
    <AuthGuard>
      <ProfileContainer
        initialSection={initialSection}
        onUpdateSuccess={(user) => {
          console.log('Profile updated successfully:', user);
        }}
        onUpdateError={(error) => {
          console.error('Profile update failed:', error);
        }}
        onPasswordChangeSuccess={() => {
          console.log('Password changed successfully');
        }}
        onPasswordChangeError={(error) => {
          console.error('Password change failed:', error);
        }}
      />
    </AuthGuard>
  );
}
