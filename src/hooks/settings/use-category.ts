import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  categoryService,
  CategoryListParams,
  AddCategoryData
} from '@/services/category.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useCategories(params: CategoryListParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getCategories(params)
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.addCategory,
    onSuccess: () => {
      toast.success('Category added successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/dashboard/settings/category');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to add category');
    // }
  });
}

export function useUpdateCategory(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCategoryData) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/dashboard/settings/category');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update category');
    // }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to delete category');
    // }
  });
}
