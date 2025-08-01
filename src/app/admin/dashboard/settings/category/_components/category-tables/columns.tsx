'use client';
import { ColumnDef } from '@/components/ui/table/data-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';
import { Category } from '@/services/category.service';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'colorCode',
    header: 'COLOR',
    cell: ({ row }) => {
      const colorCode = row.getValue('colorCode') as string;
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: colorCode }}
          />
          {colorCode}
        </div>
      );
    }
  },
  {
    accessorKey: 'categoryType',
    header: 'TYPE',
    cell: ({ row }) => {
      const categoryType = row.getValue('categoryType') as string;
      return (
        <Badge variant="outline" className="capitalize">
          {categoryType}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as number;
      return (
        <span className={status === 1 ? 'text-green-600' : 'text-red-600'}>
          {status === 1 ? 'Active' : 'Inactive'}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
