import api from '../lib/axios/api.util';

import axiosInstance from '@/lib/axios/axios.interceptor';
import {
  LOGIN_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API
} from '@/lib/axios/apis';
import Cookies from 'js-cookie';
import { AUTH_TOKEN, USER_ACCESS } from '@/config/cookie-keys';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials, userType: string) => {
    const response = await axiosInstance.post(`${api}/${userType}${LOGIN_API}`, credentials);
    if (response.data) {
      Cookies.set(AUTH_TOKEN, JSON.stringify({
        accessToken: response.data.data.accessToken,
        user: {
          personalInfo: response.data.data.user.personalInfo,
          _id: response.data.data.user._id,
          isBusinessUser: response.data.data.user?.roleInfo?.isBusinessUser
        }
      }));
      if (response.data.data?.user?.roleInfo && Object.keys(response.data.data?.user?.roleInfo).length) {
        let access = "superAdmin";
        if (response.data.data?.user?.roleInfo?.isBusinessUser) {
          access = "city,story,route";
        } else if (response.data.data?.user?.roleInfo?.roleId && Object.keys(response.data.data?.user?.roleInfo?.roleId).length) {
          access = response.data.data?.user?.roleInfo?.roleId.permissions.map((each: any) => each.moduleKey).join(",");
        }
        Cookies.set(USER_ACCESS, JSON.stringify(access));
      }
      
      toast.success('Login successful');
      return true;
    } else {
      return false;
    }
  },

  requestPasswordReset: async (data: ForgotPasswordData, userType: string) => {
    await axiosInstance.post(`${api}/${userType}${FORGOT_PASSWORD_API}`, data);
    toast.success('OTP sent to your email');
    return true;
  },

  resetPassword: async (data: ResetPasswordData, userType: string) => {
    await axiosInstance.post(`${api}/${userType}${RESET_PASSWORD_API}`, data);
    toast.success('Password reset successful');
    return true;
  }
};
