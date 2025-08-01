import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  subAdminService,
  SubAdminListParams,
  AddSubAdminData
} from '@/services/sub-admin.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useSubAdmins(params: SubAdminListParams) {
  return useQuery({
    queryKey: ['subAdmins', params],
    queryFn: () => subAdminService.getSubAdmins(params)
  });
}

export function useSubAdmin(id: string) {
  return useQuery({
    queryKey: ['subAdmin', id],
    queryFn: () => subAdminService.getSubAdmin(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddSubAdmin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subAdminService.addSubAdmin,
    onSuccess: () => {
      toast.success('Sub Admin added successfully');
      queryClient.invalidateQueries({ queryKey: ['subAdmins'] });
      router.push('/dashboard/settings/sub-admin');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to add sub admin');
    // }
  });
}

export function useUpdateSubAdmin(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSubAdminData) =>
      subAdminService.updateSubAdmin(id, data),
    onSuccess: () => {
      toast.success('Sub Admin updated successfully');
      queryClient.invalidateQueries({ queryKey: ['subAdmins'] });
      router.push('/dashboard/settings/sub-admin');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update sub admin');
    // }
  });
}

export function useDeleteSubAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subAdminService.deleteSubAdmin,
    onSuccess: () => {
      toast.success('Sub Admin deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subAdmins'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to delete sub admin');
    // }
  });
}
