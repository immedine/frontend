'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './faq-tables/columns';
import { useFAQs } from '@/hooks/settings/use-faq';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function FAQListingPage() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withOptions({ shallow: false }).withDefault(10)
  );

  const { data, isLoading } = useFAQs({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: {},
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} rowCount={10} />;
  }

  const faqs = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={faqs}
      totalItems={total}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}
