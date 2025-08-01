'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './route-tables/columns';
import { useRoutes, useRoutesBySortAndFilter } from '@/hooks/content/use-route';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useRouteTableFilters } from './route-tables/use-route-table-filters';
import { useMemo } from 'react';

export default function RouteListingPage() {
  const { searchQuery, page, pageSize, setPage, setPageSize, getSortConfig } = useRouteTableFilters();

    const queryParams = useMemo(() => {
      const sortConfig = getSortConfig;
      // console.log('Current sortConfig:', sortConfig);
      return {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        filters: searchQuery ? { "uniqueId": searchQuery } : {},
        sortConfig: sortConfig
      };
    }, [page, pageSize, searchQuery, getSortConfig]);
    
  const { data, isLoading } = useRoutesBySortAndFilter(queryParams);

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }

  const allRoutes = data?.data?.data || [];
  const total = data?.data?.total || 0;


  return (
    <DataTable
      columns={columns}
      data={allRoutes}
      totalItems={total}
      pageSizeOptions={[10]}
      externalPagination={{
        page,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
    />
  );
}
