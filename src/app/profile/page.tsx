'use client';

import { ProfileContainer } from '@/features/profile';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components';

export default function ProfilePage() {
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
