import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Suspense } from 'react';
import StoryListingPage from './_components/story-listing';
import UploadExcelButton from './_components/upload-excel-button';

export const metadata = {
  title: 'Content Management: Stories Bulk Upload',
};

export default async function Page() {

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Bulk Upload Stories"
            description="See the status of the uploaded files"
          />
          <UploadExcelButton />
        </div>
        <Separator />
        <Suspense
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <StoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
