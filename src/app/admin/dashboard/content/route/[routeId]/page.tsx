import { Metadata } from 'next';
import RouteViewPage from '../_components/route-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Route Management',
  description: 'Create or edit route details'
};

export default function Page({ params }: { params: { routeId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <RouteViewPage routeId={params.routeId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
