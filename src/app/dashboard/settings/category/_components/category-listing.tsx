'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { columns } from './category-tables/columns';
import { useCategories } from '@/hooks/settings/use-category';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import {CategoryType} from '@/config/config';

export default function CategoryListingPage() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withOptions({ shallow: false }).withDefault(10)
  );
  const [currentType, setCurrentType] = useQueryState(
    'categoryType',
    parseAsString.withOptions({ shallow: false }).withDefault('-1')
  );

  console.log('currentType', currentType);

  const { data, isLoading } = useCategories({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    filters: {
      categoryType: currentType === '-1' ? undefined : currentType
    },
    sortConfig: {}
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} rowCount={10} />;
  }

  const categories = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <>
    <div className="mb-4">
      <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700">
        Filter by Category Type
      </label>
      <select
        id="categoryType"
        name="categoryType"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        style={{ width: '150px', padding: '8px' }}
        value={currentType}
        onChange={e => {
          setCurrentType(e.target.value);
          setPage(1); // Reset to first page when filter changes
        }}
      >
        <option value="-1">All</option>
        <option value="2">Story</option>
        <option value="3">Route</option>
      </select>
    </div>
    <DataTable
      columns={columns}
      data={categories.map(each => {
        return {
          ...each,
          categoryType: CategoryType[each.categoryType]
        }
      })}
      totalItems={total}
      pageSizeOptions={[10, 20, 30, 40, 50]}
    />
  </>
  );
}
