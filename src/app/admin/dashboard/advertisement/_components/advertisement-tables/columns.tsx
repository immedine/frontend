'use client';
import { ColumnDef } from '@/components/ui/table/data-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';
import Image from 'next/image';

export type Advertisement = {
  id: string;
  type: 'audio' | 'image' | 'video';
  media: string;
  languageRef?: string;
  createdAt: Date;
};

export const columns: ColumnDef<Advertisement>[] = [
  {
    accessorKey: 'type',
    header: 'TYPE',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'media',
    header: 'MEDIA',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const media = row.getValue('media') as string;

      if (type === 'image') {
        return (
          <div className="relative aspect-square w-20">
            <Image
              src={media}
              alt="Advertisement"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        );
      }

      return (
        <Badge variant="secondary">
          {type === 'audio' ? 'Audio File' : 'Video File'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'languageRef',
    header: 'LANGUAGE',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const language = row.getValue('languageRef') as string;

      return type === 'audio' ? (
        <Badge variant="outline">{language}</Badge>
      ) : (
        <span>-</span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
