import { Metadata } from 'next';
import AdvertisementViewPage from '../_components/advertisement-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Advertisement Management',
  description: 'Create or edit advertisement'
};

export default function Page({
  params
}: {
  params: { advertisementId: string };
}) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <AdvertisementViewPage advertisementId={params.advertisementId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
