'use client';

import { ColumnDef } from '@/components/ui/table/data-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { Route } from '@/services/route.service';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouteTableFilters } from './use-route-table-filters';

// Create a sortable header component that uses the filters hook
const SortableHeader = ({ title, sortKey }: { title: string; sortKey: string }) => {
  const { sortField, sortOrder, setSortField, setSortOrder, setPage } = useRouteTableFilters();

  const isCurrentSort = sortField === sortKey;
  const isAsc = isCurrentSort && sortOrder === 1;
  const isDesc = isCurrentSort && sortOrder === -1;

  const handleSort = () => {
    if (isAsc) {
      // Currently ascending, switch to descending
      setSortOrder(-1);
    } else if (isDesc) {
      // Currently descending, clear sort
      setSortField('');
      setSortOrder(1);
    } else {
      // Not sorted, set to ascending
      setSortField(sortKey);
      setSortOrder(1);
    }
    setPage(1); // Reset to first page
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {title}
      {isAsc ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : isDesc ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
};

export const columns: ColumnDef<Route>[] = [
  {
    accessorKey: 'uniqueId',
    header: () => <SortableHeader title="ROUTE ID" sortKey="uniqueId" />,
  },
  {
    accessorKey: 'cityRef',
    header: () => <SortableHeader title="CITY" sortKey="city" />,
    cell: ({ row }) => {
      const cityRef = row.getValue('cityRef') as { city: string };
      return cityRef?.city || '-';
    }
  },
  {
    accessorKey: 'fullAddress',
    header: 'ADDRESS',
    cell: ({ row }) => {
      const fullAddress = row.getValue('fullAddress') as { address: string };
      return fullAddress?.address || '-';
    }
  },
  {
    accessorKey: 'images',
    header: 'IMAGE',
    cell: ({ row }) => {
      const images = row.getValue('images') as string[];
      if (!images?.length) return null;

      return (
        <div className="relative h-10 w-10">
          <Image
            src={images[0]}
            alt="Route"
            fill
            sizes='(100px)'
            className="rounded-md object-cover"
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'hideFromApp',
    header: 'HIDE FROM APP',
    cell: ({ row }) => {
      const hideFromApp = row.getValue('hideFromApp') as boolean;
      return hideFromApp ? (
        <Badge variant="secondary">Hidden</Badge>
      ) : null;
    }
  },
  // {
  //   accessorKey: 'isRecommended',
  //   header: 'RECOMMENDED',
  //   cell: ({ row }) => {
  //     const isRecommended = row.getValue('isRecommended') as boolean;
  //     return isRecommended ? (
  //       <Badge variant="secondary">Recommended</Badge>
  //     ) : null;
  //   }
  // },
  {
    accessorKey: 'storyRefs',
    header: 'STORIES',
    cell: ({ row }) => {
      const storyRefs = row.getValue('storyRefs') as Array<{
        uniqueId: string;
      }>;
      return storyRefs?.length ? (
        <Badge variant="outline">{storyRefs.length} stories</Badge>
      ) : null;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

