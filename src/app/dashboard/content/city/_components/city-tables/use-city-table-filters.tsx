'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState, parseAsInteger } from 'nuqs';
import { useCallback } from 'react';

export function useCityTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withOptions({ shallow: false }).withDefault(10)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setPage(1);
  }, [setSearchQuery, setPage]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
    resetFilters
  };
}
