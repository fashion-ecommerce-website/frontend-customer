/**
 * Profile Page
 * User profile management page
 */

'use client';

import { ProfileContainer } from '@/features/profile';

export default function ProfilePage() {
  return (
    <ProfileContainer
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
  );
}
