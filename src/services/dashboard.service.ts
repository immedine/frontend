import axiosInstance from '@/lib/axios/axios.interceptor';

const DASHBOARD_API = '/dashboard/stats';

export const dashboardService = {

  getDashboard: async (userType: string) => {
    const response = await axiosInstance.get<SingleRoleResponse>(
      `/account/${userType}${DASHBOARD_API}`
    );
    return response.data;
  },
};
