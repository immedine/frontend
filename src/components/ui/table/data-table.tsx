'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, Pencil, Trash2 } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  // New props for external pagination control
  externalPagination?: {
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  externalPagination,
  onDelete,
  onEdit
}: DataTableProps<TData, TValue>) {
  // Internal state - only used when externalPagination is not provided
  // const [internalCurrentPage, setInternalCurrentPage] = useQueryState(
  //   'page',
  //   parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  // );
  // const [internalPageSize, setInternalPageSize] = useQueryState(
  //   'limit',
  //   parseAsInteger
  //     .withOptions({ shallow: false, history: 'push' })
  // );

  // Use external pagination if provided, otherwise use internal state
  const currentPage = externalPagination?.page;
  const pageSize = 15;
  const setCurrentPage = externalPagination?.onPageChange;
  // const setPageSize = externalPagination?.onPageSizeChange;

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize: pageSize
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = async (
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    if (externalPagination) {
      // Use external handlers
      externalPagination.onPageChange(pagination.pageIndex + 1);
      // externalPagination.onPageSizeChange(pagination.pageSize);
    } else {
      // Use internal state setters
      await Promise.all([
        setCurrentPage(pagination.pageIndex + 1),
        // setPageSize(pagination.pageSize)
      ]);
    }
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  return (
    <div className="space-y-4">
      <ScrollArea className="grid h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {onDelete || onEdit ?
                  <TableCell>
                    <button className="mr-2" onClick={() => onEdit(row.id)}>
                      <Pencil />
                    </button>
                    <button onClick={() => onDelete(row.id)}>
                      <Trash2 />
                    </button>
                  </TableCell> : null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing{' '}
                {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  totalItems
                )}{' '}
                of {totalItems} entries
              </>
            ) : (
              'No entries found'
            )}
          </div>
          {/* <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={paginationState.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[150px] items-center justify-center text-sm font-medium">
            {totalItems > 0 ? (
              <>
                Page {paginationState.pageIndex + 1} of {pageCount}
              </>
            ) : (
              'No pages'
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef };