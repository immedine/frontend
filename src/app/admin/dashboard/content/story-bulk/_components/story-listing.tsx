'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './story-tables/columns';
import { useStoryFiles } from '@/hooks/content/use-story';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function StoryListingPage() {

  const { data, isLoading } = useStoryFiles({
    skip: 0,
    limit: 0,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }

  const allStories = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={allStories}
      totalItems={total}
      pageSizeOptions={[10]}
    />
  );
}
