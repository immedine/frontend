import { Metadata } from 'next';
import StoryViewPage from '../_components/story-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Story Management',
  description: 'Create or edit story details'
};

export default function Page({ params }: { params: { storyId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <StoryViewPage storyId={params.storyId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
