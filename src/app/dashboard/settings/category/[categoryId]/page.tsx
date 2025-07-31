import { Metadata } from 'next';
import CategoryViewPage from '../_components/category-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Category Management',
  description: 'Create or edit category'
};

export default function Page({ params }: { params: { categoryId: string } }) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <CategoryViewPage categoryId={params.categoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
