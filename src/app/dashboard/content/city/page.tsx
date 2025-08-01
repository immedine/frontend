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
import CityListingPage from './_components/city-listing';

import CityTableAction from './_components/city-tables/city-table-action';

export const metadata = {
  title: 'Content Management: Cities'
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
            title="Cities"
            description="Manage city listings and their details"
          />
          <Link
            href="/dashboard/content/city/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <CityTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <CityListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
