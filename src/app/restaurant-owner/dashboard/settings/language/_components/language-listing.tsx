'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './language-tables/columns';
import { useLanguages } from '@/hooks/settings/use-language';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function LanguageListingPage() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withOptions({ shallow: false }).withDefault(10)
  );

  const { data, isLoading } = useLanguages({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: {},
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={3} rowCount={10} />;
  }

  const languages = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={languages}
      totalItems={total}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}