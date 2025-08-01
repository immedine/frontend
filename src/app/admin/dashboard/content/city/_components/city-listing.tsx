'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './city-tables/columns';
import { useCities } from '@/hooks/content/use-city';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useCityTableFilters } from './city-tables/use-city-table-filters';

export default function CityListingPage() {
  const { searchQuery, page, pageSize, setPage, setPageSize } = useCityTableFilters();
  
  const { data, isLoading } = useCities({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: searchQuery ? { "name": searchQuery } : {},
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} rowCount={10} />;
  }

  const allCities = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={allCities}
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