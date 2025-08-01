'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Options } from 'nuqs';
import { useTransition, FormEvent, useState } from 'react';

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options<any> | undefined
  ) => Promise<URLSearchParams>;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  enableSubmit?: boolean;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
  setPage,
  enableSubmit = false
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await setSearchQuery(inputValue, { startTransition });
    setPage(1);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:max-w-sm">
      <Input
        placeholder={`Search ${searchKey}...`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn('flex-1', isLoading && 'animate-pulse')}
      />
      {enableSubmit && (
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(isLoading && 'animate-pulse')}
        >
          Search
        </Button>
      )}
    </form>
  );
}