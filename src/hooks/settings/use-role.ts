import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  roleService,
  RoleListParams,
  AddRoleData
} from '@/services/role.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useRoles(params: RoleListParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => roleService.getRoles(params)
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getRole(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddRole() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.addRole,
    onSuccess: () => {
      toast.success('Role added successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.push('/dashboard/settings/role');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to add role');
    // }
  });
}

export function useUpdateRole(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddRoleData) =>
      roleService.updateRole(id, data),
    onSuccess: () => {
      toast.success('Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.push('/dashboard/settings/role');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update role');
    // }
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      toast.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to delete role');
    // }
  });
}
