import axiosInstance from '@/lib/axios/axios.interceptor';

const PROFILE_API = '/account/admin/profile';

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

  updateProfile: async (data: FormData) => {
    const response = await axiosInstance.put(PROFILE_API, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await axiosInstance.put(
      `${PROFILE_API}/change-password`,
      data
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.put(`${PROFILE_API}/logout`);
    return response.data;
  }
};
