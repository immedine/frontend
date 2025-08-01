'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@/components/ui/table/data-table';
import { Story } from '@/services/story.service';

const FileUploadStatus: any = {
  1: 'Uploaded',
  2: 'Processed',
}

export const columns: ColumnDef<Story>[] = [
  {
    accessorKey: 'originalFileName',
    header: 'FILE NAME',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as number;

      return <Badge variant={`${status === 2 ? "default" : "secondary"}`}>{FileUploadStatus[status]}</Badge>;
    }
  }
];
