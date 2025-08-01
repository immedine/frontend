import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cityService,
  CityListParams,
  AddCityData
} from '@/services/city.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useCities(params: CityListParams) {
  return useQuery({
    queryKey: ['cities', params],
    queryFn: () => cityService.getCities(params)
  });
}

export function useCity(id: string) {
  return useQuery({
    queryKey: ['cities', id],
    queryFn: () => cityService.getCity(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddCity() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cityService.addCity,
    onSuccess: () => {
      toast.success('City added successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      router.push('/dashboard/content/city');
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to add city');
    }
  });
}

export function useUpdateCity(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCityData) => cityService.updateCity(id, data),
    onSuccess: () => {
      toast.success('City updated successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      router.push('/dashboard/content/city');
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to update city');
    }
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cityService.deleteCity,
    onSuccess: () => {
      toast.success('City deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (error: any) => {
      // toast.error(error?.message || 'Failed to delete city');
    }
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getAllCities()
  });
}
