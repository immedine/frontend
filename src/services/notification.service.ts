import axiosInstance from '@/lib/axios/axios.interceptor';

const NOTIFICATION_API = '/account/admin/notification';

export const notificationService = {

  sendNotification: async (data: any) => {
    const response = await axiosInstance.post<any>(
      `${NOTIFICATION_API}`,
      data
    );
    return response.data;
  },
};
