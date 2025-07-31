'use client';

import { ColumnDef } from '@/components/ui/table/data-table';
import { FAQ } from '../faq-form';
import { CellAction } from './cell-action';

export const columns: ColumnDef<FAQ>[] = [
  {
    accessorKey: 'question',
    header: 'QUESTION'
  },
  {
    accessorKey: 'answer',
    header: 'ANSWER',
    cell: ({ row }) => {
      const answer: string = row.getValue('answer');
      return <div className="max-w-[500px] truncate">{answer}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
