import axiosInstance from '@/lib/axios/axios.interceptor';

const CONFIG_API = '/account/admin/global-config';

export const configService = {

  updateConfig: async (data: any) => {
    const response = await axiosInstance.put<any>(
      `${CONFIG_API}`,
      data
    );
    return response.data;
  },

  getConfig: async () => {
    const response = await axiosInstance.get<any>(
      `${CONFIG_API}`
    );
    return response.data;
  }
};
