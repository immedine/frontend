import { Metadata } from 'next';
import SubAdminViewPage from '../_components/sub-admin-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sub-Admin Management',
  description: 'Create or edit sub-admin'
};

export default function Page({ params }: { params: { subAdminId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <SubAdminViewPage subAdminId={params.subAdminId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
