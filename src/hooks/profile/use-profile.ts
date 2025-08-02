import { useMutation, useQuery } from '@tanstack/react-query';
import { profileService, ChangePasswordData } from '@/services/profile.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/config/cookie-keys';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: FormData) => profileService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to update profile');
    // }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to change password');
    // }
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: profileService.logout,
    onSuccess: () => {
      // Clear auth token
      Cookies.remove(AUTH_TOKEN);
      // Show success message
      toast.success('Logged out successfully');
      // Redirect to login
      router.push('/restaurant-owner/auth/sign-in');

    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to logout');
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile
  });
}
