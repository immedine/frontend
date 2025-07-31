'use client';

import { ColumnDef } from '@/components/ui/table/data-table';
import { City } from '@/services/city.service';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: 'photo',
    header: 'IMAGE',
    cell: ({ row }) => {
      const photo = row.getValue('photo') as string;
      return photo ? (
        <div className="relative h-10 w-10">
          <Image
            src={photo}
            alt="City"
            fill
            sizes='(100px)'
            className="rounded-md object-cover"
          />
        </div>
      ) : null;
    }
  },
  {
    accessorKey: 'country',
    header: 'Country'
  },
  {
    accessorKey: 'city',
    header: 'City'
  },
  // {
  //   accessorKey: 'languageRefs',
  //   header: 'Languages',
  //   cell: ({ row }) => {
  //     const languageRefs = row.getValue('languageRefs') as { name: string }[];
  //     const languages = languageRefs.map((item) => {
  //       return item.name;
  //     });
  //     return (
  //       <p className="">
  //         {languages.map((name, index) => (
  //           <span key={index} className="mr-0.5">
  //             {' '}
  //             {name}
  //           </span>
  //         ))}
  //       </p>
  //     );
  //   }
  // },
  ,{
    accessorKey: 'hideFromApp',
    header: 'HIDE FROM APP',
    cell: ({ row }) => {
      const hideFromApp = row.getValue('hideFromApp') as boolean;
      return hideFromApp ? (
        <Badge variant="secondary">Hidden</Badge>
      ) : null;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
