import { searchParamsCache, serialize } from '@/lib/searchparams';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/parsers';
import { Suspense } from 'react';
import StoryListingPage from './_components/story-listing';
import StoryTableAction from './_components/story-tables/story-table-action';

export const metadata = {
  title: 'Content Management: Stories'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Stories"
            description="Manage story listings and their details"
          />
          <div>
            <Link
              href="/dashboard/content/story-bulk"
              className={cn(buttonVariants({ variant: 'outline' }), 'text-xs md:text-sm align-bottom mr-2')}
            >
              Bulk Upload
            </Link>
            <Link
              href="/dashboard/content/story/new"
              className={cn(buttonVariants(), 'text-xs md:text-sm align-bottom')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          
        </div>
        <Separator />
       
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <StoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
