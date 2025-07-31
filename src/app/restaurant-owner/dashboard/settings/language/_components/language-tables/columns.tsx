'use client';

import { ColumnDef } from '@/components/ui/table/data-table';
import { Language } from '@/services/language.service';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Language>[] = [
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'code',
    header: 'LANGUAGE CODE'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

