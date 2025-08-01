'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Button } from '@/components/ui/button';
import { ArrowDownUpIcon, ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouteTableFilters } from './use-route-table-filters';

export default function RouteTableAction() {
  const { searchQuery, setSearchQuery, setPage } = useRouteTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      <DataTableSearch
        searchKey="Route Id"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
        enableSubmit
      />
    </div>
  );
}
