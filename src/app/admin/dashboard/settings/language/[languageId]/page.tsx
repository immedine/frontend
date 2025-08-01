import { Metadata } from 'next';
import LanguageViewPage from '../_components/language-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Language Management',
  description: 'Create or edit language'
};

export default function Page({ params }: { params: { languageId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <LanguageViewPage languageId={params.languageId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
