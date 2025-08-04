import { Metadata } from 'next';
import ProfileEditForm from './_components/profile-edit-form';
import PasswordChangeForm from './_components/password-change-form';
import ProfileOverview from './_components/profile-overview';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'Profile | Dashboard',
  description: 'Manage your profile settings'
};

export default function ProfilePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* <ProfileOverview /> */}
        <ProfileEditForm />
        <PasswordChangeForm />
      </div>
    </PageContainer>
  );
}
