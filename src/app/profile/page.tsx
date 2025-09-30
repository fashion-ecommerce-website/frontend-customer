'use client';

import { ProfileContainer } from '@/features/profile';
import { AuthGuard } from '@/components';
import { useSearchParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useSearchParams();
  const initialSection = params.get('section') || undefined;
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
