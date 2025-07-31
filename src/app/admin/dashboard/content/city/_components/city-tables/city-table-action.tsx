'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useCityTableFilters } from './use-city-table-filters';
import { Button } from '@/components/ui/button';
import { ArrowDownUpIcon } from 'lucide-react';
export default function CityTableAction() {
  const { searchQuery, setSearchQuery, setPage } = useCityTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
        enableSubmit
      />
    </div>
  );
}
