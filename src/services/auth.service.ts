import api from '../lib/axios/api.util';

import axiosInstance from '@/lib/axios/axios.interceptor';
import {
  LOGIN_API,
  SOCIAL_LOGIN_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  VERIFY_TOKEN_API,
  VERIFY_REGISTRATION_TOKEN_API,
  REGISTER_API
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
      if (response.data.data.user.accountStatus === 4) {
        toast.error('Please verify your account to continue!');

        return false;
      }
      Cookies.set(AUTH_TOKEN, JSON.stringify({
        accessToken: response.data.data.accessToken,
        user: {
          personalInfo: response.data.data.user.personalInfo,
          _id: response.data.data.user._id,
          restaurantId: response.data.data.user.restaurantRef
        }
      }));
      if (response.data.data?.user?.roleInfo && Object.keys(response.data.data?.user?.roleInfo).length) {
        let access = "superAdmin";
        if (response.data.data?.user?.roleInfo?.roleId && Object.keys(response.data.data?.user?.roleInfo?.roleId).length) {
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

  socialLogin: async (credentials: LoginCredentials, userType: string = 'restaurant-owner') => {
    const response = await axiosInstance.post(`${api}/${userType}${SOCIAL_LOGIN_API}`, credentials);
    if (response.data) {
      console.log("response.data ", response.data)
      if (response.data.data.message === "NEW_REGISTER") {
        return response.data.data.message;
      }
      if (response.data.data.user.accountStatus === 4) {
        toast.error('Please verify your account to continue!');

        return false;
      }
      Cookies.set(AUTH_TOKEN, JSON.stringify({
        accessToken: response.data.data.accessToken,
        user: {
          personalInfo: response.data.data.user.personalInfo,
          _id: response.data.data.user._id,
          restaurantId: response.data.data.user.restaurantRef
        }
      }));
      if (response.data.data?.user?.roleInfo && Object.keys(response.data.data?.user?.roleInfo).length) {
        let access = "superAdmin";
        if (response.data.data?.user?.roleInfo?.roleId && Object.keys(response.data.data?.user?.roleInfo?.roleId).length) {
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

  register: async (credentials: any, userType: string) => {
    const response = await axiosInstance.post(`${api}/${userType}${REGISTER_API}`, credentials);
    if (response.data) {   
      !credentials.socialId && toast.success('A verification link has been sent to your registered email address.');
      return true;
    } else {
      return false;
    }
  },

  requestPasswordReset: async (data: ForgotPasswordData, userType: string) => {
    await axiosInstance.post(`${api}/${userType}${FORGOT_PASSWORD_API}`, data);
    toast.success('A verification link has been sent to your email');
    return true;
  },

  verifyToken: async (data: string, userType: string = 'restaurant-owner') => {
    const res = await axiosInstance.post(`${api}/${userType}${VERIFY_TOKEN_API}`, {
      token: data
    });
    return res;
  },

  verifyRegistrationToken: async (data: string, userType: string = 'restaurant-owner') => {
    const res = await axiosInstance.post(`${api}/${userType}${VERIFY_REGISTRATION_TOKEN_API}`, {
      token: data
    });
    return res;
  },

  resetPassword: async (data: ResetPasswordData, userType: string) => {
    const res = await axiosInstance.post(`${api}/${userType}${RESET_PASSWORD_API}`, data);
    return res;
  }
};
