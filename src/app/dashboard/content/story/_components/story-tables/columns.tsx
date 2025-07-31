'use client';
import { ColumnDef } from '@/components/ui/table/data-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';
import { Story } from '@/services/story.service';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useStoryTableFilters } from './use-story-table-filters';

// Create a sortable header component that uses the filters hook
const SortableHeader = ({ title, sortKey }: { title: string; sortKey: string }) => {
  const { sortField, sortOrder, setSortField, setSortOrder, setPage } = useStoryTableFilters();

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

export const columns: ColumnDef<Story>[] = [
  {
    accessorKey: 'uniqueId',
    header: () => <SortableHeader title="STORY ID" sortKey="uniqueId" />,
  },
  {
    accessorKey: 'images',
    header: 'IMAGE',
    cell: ({ row }) => {
      console.log(row, 'a');
      const images = row.getValue('images') as string[];
      const firstImage = images[0];
      return firstImage ? (
        <div className="relative h-10 w-10">
          <Image
            src={firstImage}
            alt="Story"
            fill
            sizes='(100px)'
            className="rounded-md object-cover"
          />
        </div>
      ) : null;
    }
  },
  {
    accessorKey: 'cityRef.city',
    header: () => <SortableHeader title="CITY" sortKey="city" />,
  },
  {
    accessorKey: 'languageDetails',
    header: () => <SortableHeader title="NAME" sortKey="name" />,
    cell: ({ row }) => {
      console.log(row, 'a');
      const languageDetails = row.getValue('languageDetails') as string[];
      const engLang = languageDetails.filter(each => each.languageRef?.name?.toLowerCase() === 'english')[0];
      return engLang ? (
        <div>
          {engLang.name}
        </div>
      ) : null;
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
  {
    accessorKey: 'categoryRefs',
    header: 'CATEGORY',
    cell: ({ row }) => {
      const categoryRefs = row.getValue('categoryRefs') as { name: string }[];
      const categories = categoryRefs.map((item) => {
        return item.name;
      });
      return (
        <p className="">
          {categories.map((name, index) => (
            <span key={index} className="mr-0.5">
              {' '}
              {name}
            </span>
          ))}
        </p>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];