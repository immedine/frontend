import { useMutation } from '@tanstack/react-query';
import {
    notificationService
} from '@/services/notification.service';
import { toast } from 'sonner';

export function useSendNotification() {
  return useMutation({
    mutationFn: (data: any) =>
        notificationService.sendNotification(data),
    onSuccess: () => {
      toast.success('Notification sent successfully');
    //   queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update faq');
    // }
  });
}

