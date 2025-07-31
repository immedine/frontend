import { useMutation, useQuery } from '@tanstack/react-query';
import {
  configService
} from '@/services/config.service';
import { toast } from 'sonner';

export function useConfig() {
  return useQuery({
    queryKey: ['config', "config"],
    queryFn: () => configService.getConfig()
  });
}

export function useUpdateConfig() {
  return useMutation({
    mutationFn: (data: any) =>
      configService.updateConfig(data),
    onSuccess: () => {
      toast.success('Global Config updated successfully');
    //   queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update faq');
    // }
  });
}

