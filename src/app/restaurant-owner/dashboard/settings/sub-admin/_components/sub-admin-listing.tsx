'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useSubAdmins } from '@/hooks/settings/use-sub-admin';
import { columns } from './sub-admin-tables/columns';
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

  const { data, isLoading } = useSubAdmins({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: {},
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={3} rowCount={10} />;
  }

  const subAdmins = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <DataTable
      columns={columns}
      data={subAdmins.map(each=> {
        return {
          ...each,
          name: `${each.personalInfo.firstName} ${each.personalInfo.lastName}`,
          email: each.personalInfo.email,
          role: each.roleInfo.isSuperAdmin ? "Super Admin" : each.roleInfo.isBusinessUser ? "Business User" : each.roleInfo.roleId.name
        }
      })}
      totalItems={total}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  );
}
