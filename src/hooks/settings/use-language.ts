import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  languageService,
  LanguageListParams,
  AddLanguageData
} from '@/services/language.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useLanguages(params: LanguageListParams) {
  return useQuery({
    queryKey: ['languages', params],
    queryFn: () => languageService.getLanguages(params)
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: ['language', id],
    queryFn: () => languageService.getLanguage(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddLanguage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: languageService.addLanguage,
    onSuccess: () => {
      toast.success('Language added successfully');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      router.push('/dashboard/settings/language');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to add language');
    // }
  });
}

export function useUpdateLanguage(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddLanguageData) =>
      languageService.updateLanguage(id, data),
    onSuccess: () => {
      toast.success('Language updated successfully');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      router.push('/dashboard/settings/language');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update language');
    // }
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: languageService.deleteLanguage,
    onSuccess: () => {
      toast.success('Language deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to delete language');
    // }
  });
}
