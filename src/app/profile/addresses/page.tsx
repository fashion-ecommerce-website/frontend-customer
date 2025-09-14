'use client';

import { ProfileContainer } from '@/features/profile';
import { AuthGuard } from '@/components';

export default function AddressesPage() {
  return (
    <AuthGuard>
      <ProfileContainer
        initialSection="shipping-address"
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