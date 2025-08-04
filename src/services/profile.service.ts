import axiosInstance from '@/lib/axios/axios.interceptor';

const PROFILE_API = '/profile';

export interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    country?: string;
  };
  roleInfo: {
    isSuperAdmin: boolean;
  };
  settings: {
    selectedLanguage: string;
  };
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const profileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(PROFILE_API);
    return response.data;
  },

  updateProfile: async (data: FormData,userType: string) => {
    const response = await axiosInstance.put(`/account/${userType}${PROFILE_API}`, data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData, userType: string) => {
    const response = await axiosInstance.put(
      `/account/${userType}${PROFILE_API}/change-password`,
      data
    );
    return response.data;
  },

  logout: async (userType: string = 'restaurant-owner') => {
    const response = await axiosInstance.put(`/account/${userType}${PROFILE_API}/logout`);
    return response.data;
  }
};
