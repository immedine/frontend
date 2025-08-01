'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useRoles } from '@/hooks/settings/use-role';
import { Role, columns } from './role-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useQueryState, parseAsInteger } from 'nuqs';

export default async function RoleListingPage() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withOptions({ shallow: false }).withDefault(10)
  );

  const { data, isLoading } = useRoles({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: {},
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={3} rowCount={10} />;
  }

  const roles = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={roles.map(each=> {
        return {
          ...each,
          permissions: each.permissions.map(each1 => each1.moduleName)
        }
      })}
      totalItems={total}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}
