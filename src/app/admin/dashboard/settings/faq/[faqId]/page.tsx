import { Metadata } from 'next';
import FAQForm from '../_components/faq-form';
import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'FAQ Management',
  description: 'Create or edit FAQ'
};

export default function FAQEditPage({ params }: { params: { faqId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <FAQForm
            faqId={params.faqId}
            pageTitle={params.faqId === 'new' ? 'Create FAQ' : 'Edit FAQ'}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
