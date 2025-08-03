import axiosInstance from '@/lib/axios/axios.interceptor';

const RESTAURANT_API = '/restaurant';

export const restaurantService = {

  updateRestaurant: async (data: any, userType: string) => {
    const response = await axiosInstance.put<any>(
      `/account/${userType}${RESTAURANT_API}`,
      data
    );
    return response.data;
  },

  getRestaurant: async (userType: string) => {
    const response = await axiosInstance.get<any>(
      `/account/${userType}${RESTAURANT_API}`
    );
    return response.data;
  },

  getRestaurantFromApp: async (id: string) => {
    const response = await axiosInstance.get<any>(
      `/user/${RESTAURANT_API}/${id}`
    );
    return response.data;
  }
};
