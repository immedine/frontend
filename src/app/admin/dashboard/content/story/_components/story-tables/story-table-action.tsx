'use client';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useStoryTableFilters } from './use-story-table-filters';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  _id: string;
  name: string;
}

interface StoryTableActionProps {
  categories?: Category[];
}

export default function StoryTableAction({ categories = [] }: StoryTableActionProps) {
  const {
    searchQuery,
    setSearchQuery,
    categoryIds,
    setCategoryIds,
    setPage,
    resetFilters
  } = useStoryTableFilters();

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setCategoryIds([]);
    } else {
      setCategoryIds([categoryId]);
    }
    setPage(1); // Reset to first page when filter changes
  };

  // Ensure categories is an array before using array methods
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const hasActiveFilters = searchQuery || categoryIds.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={categoryIds.length > 0 ? categoryIds[0] : 'all'}
            onValueChange={handleCategoryChange}
            disabled={categoriesArray.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={
                categoriesArray.length === 0 
                  ? "Loading categories..." 
                  : "Select category"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesArray.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

       
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        <DataTableSearch
          searchKey="Story Id or Name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
          enableSubmit
        />
      </div>
    </div>
  );
}