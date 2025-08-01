// Updated StoryListingPage.tsx
'use client';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './story-tables/columns';
import { useStories, useStoriesBySortAndFilter } from '@/hooks/content/use-story';
import { useStoryTableFilters } from './story-tables/use-story-table-filters';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useCategories } from '@/hooks/settings/use-category';
import StoryTableAction from './story-tables/story-table-action';

export default function StoryListingPage() {
  const { data: categoryData, isLoading: isCategoryLoading } = useCategories({
    skip: 0,
    limit: 1000,
  });

  const { searchQuery, categoryIds, page, pageSize, setPage, setPageSize, getSortConfig } = useStoryTableFilters();

  const queryParams = useMemo(() => {
    const sortConfig = getSortConfig;
    const filters: any = {};
    
    if (searchQuery) {
      filters.searchText = searchQuery;
    }
    
    if (categoryIds.length > 0) {
      filters.categoryIds = categoryIds;
    }

    return {
      skip: (page - 1) * pageSize,
      limit: pageSize,
      filters,
      sortConfig: sortConfig
    };
  }, [page, pageSize, searchQuery, categoryIds, getSortConfig]);

  const { data, isLoading } = useStoriesBySortAndFilter(queryParams);

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }

  const allStories = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4">
      <StoryTableAction categories={categoryData?.data.data} />
      <DataTable
        columns={columns}
        data={allStories}
        totalItems={total}
        pageSizeOptions={[50]}
        externalPagination={{
          page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}