import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AUTH_TOKEN, USER_ACCESS } from '@/config/cookie-keys';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Save entire auth data to cookies
      Cookies.set(AUTH_TOKEN, JSON.stringify({
        accessToken: data.data.accessToken,
        user: {
          personalInfo: data.data.user.personalInfo,
          _id: data.data.user._id,
          isBusinessUser: data.data.user?.roleInfo?.isBusinessUser
        }
      }));
      if (data.data?.user?.roleInfo && Object.keys(data.data?.user?.roleInfo).length) {
        let access = "superAdmin";
        if (data.data?.user?.roleInfo?.isBusinessUser) {
          access = "city,story,route";
        } else if (data.data?.user?.roleInfo?.roleId && Object.keys(data.data?.user?.roleInfo?.roleId).length) {
          access = data.data?.user?.roleInfo?.roleId.permissions.map(each => each.moduleKey).join(",");
        }
        Cookies.set(USER_ACCESS, JSON.stringify(access));
      }
      
      toast.success('Login successful');
      router.push('/dashboard/overview');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Login failed');
    // }
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.requestPasswordReset,
    onSuccess: (_, variables) => {
      toast.success('OTP sent to your email');
      // Redirect to reset password with email
      router.push(`/auth/reset-password?email=${variables.email}`);
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to send OTP');
    // }
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful');
      router.push('/restaurant-owner/auth/sign-in');
    },
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Password reset failed');
    // }
  });
}
