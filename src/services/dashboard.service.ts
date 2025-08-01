import axiosInstance from '@/lib/axios/axios.interceptor';

const DASHBOARD_API = '/account/admin/dashboard/stats';

export const dashboardService = {

  getDashboard: async () => {
    const response = await axiosInstance.get<SingleRoleResponse>(
      `${DASHBOARD_API}`
    );
    return response.data;
  },
};
