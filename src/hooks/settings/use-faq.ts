import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  faqService,
  FAQListParams,
  AddFAQData
} from '@/services/faq.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useFAQs(params: FAQListParams) {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqService.getFAQs(params)
  });
}

export function useFAQ(id: string) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => faqService.getFAQ(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddFAQ() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faqService.addFAQ,
    onSuccess: () => {
      toast.success('FAQ added successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      router.push('/dashboard/settings/faq');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to add faq');
    // }
  });
}

export function useUpdateFAQ(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFAQData) =>
      faqService.updateFAQ(id, data),
    onSuccess: () => {
      toast.success('FAQ updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      router.push('/dashboard/settings/faq');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update faq');
    // }
  });
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faqService.deleteFAQ,
    onSuccess: () => {
      toast.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to delete faq');
    // }
  });
}
