'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useRouteTableFilters() {
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

  const [sortField, setSortField] = useQueryState(
    'sortField',
    parseAsString.withOptions({ shallow: false }).withDefault('')
  );

  const [sortOrder, setSortOrder] = useQueryState(
    'sortOrder',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const getSortConfig = useMemo(() => {
    if (!sortField) return {};
    return { [sortField]: sortOrder };
  }, [sortField, sortOrder]);

  // Function to handle column sorting from table
  const handleColumnSort = useCallback(
    (columnId: string, direction: 'asc' | 'desc' | false) => {
      if (direction === false) {
        // Clear sorting
        setSortField('');
        setSortOrder(1);
      } else {
        // Map column IDs to API field names
        const fieldMapping = {
          uniqueId: 'uniqueId',
          'cityRef.city': 'city'
        };
        const apiField = fieldMapping[columnId] || columnId;
        setSortField(apiField);
        setSortOrder(direction === 'asc' ? 1 : -1);
      }
      setPage(1); // Reset to first page when sorting changes
    },
    [setSortField, setSortOrder, setPage]
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setSortField(null);
    setSortOrder(1);
    setPage(1);
  }, [setSearchQuery, setSortField, setSortOrder, setPage]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    getSortConfig,
    handleColumnSort,
    resetFilters
  };
}
