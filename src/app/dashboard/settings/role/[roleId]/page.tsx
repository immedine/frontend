import { Metadata } from 'next';
import RoleViewPage from '../_components/role-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Role Management',
  description: 'Create or edit role'
};

export default function Page({ params }: { params: { roleId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RoleViewPage roleId={params.roleId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
