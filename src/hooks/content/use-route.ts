import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  routeService,
  RouteListParams,
  AddRouteData
} from '@/services/route.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useRoutes(params: RouteListParams) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => routeService.getRoutes(params)
  });
}

export function useRoutesBySortAndFilter(params: RouteListParams) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => routeService.getRoutesBySortAndFilter(params)
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => routeService.getRoute(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routeService.addRoute,
    onSuccess: () => {
      toast.success('Route added successfully');
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      router.push('/dashboard/content/route');
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to add route');
    }
  });
}

export function useUpdateRoute(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddRouteData) => routeService.updateRoute(id, data),
    onSuccess: () => {
      toast.success('Route updated successfully');
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      router.back();
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to update route');
    }
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routeService.deleteRoute,
    onSuccess: () => {
      toast.success('Route deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to delete route');
    }
  });
}
