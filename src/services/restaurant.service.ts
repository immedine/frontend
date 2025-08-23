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

  getRestaurants: async (params: any, userType: string) => {
    const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<CategoryResponse>(
      `/account/${userType}${RESTAURANT_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  getRestaurantFromApp: async (id: string) => {
    const response = await axiosInstance.get<any>(
      `/user/${RESTAURANT_API}/${id}`
    );
    return response.data;
  },

  addRestaurantFromAdmin: async (data: any, userType: string) => {
    const response = await axiosInstance.post<any>(
      `/account/${userType}${RESTAURANT_API}/add`,
      data
    );
    return response.data;
  },

  getRestaurantFromAdmin: async (id: string, userType: string) => {
    const response = await axiosInstance.get<any>(
      `/account/${userType}${RESTAURANT_API}/${id}`
    );
    return response.data;
  },

  updateRestaurantFromAdmin: async (id: string, data: any, userType: string) => {
    const response = await axiosInstance.put<any>(
      `/account/${userType}${RESTAURANT_API}/${id}`,
      data
    );
    return response.data;
  },

  deleteRestaurantFromAdmin: async (id: string, userType: string) => {
    const response = await axiosInstance.delete<any>(
      `/account/${userType}${RESTAURANT_API}/${id}`
    );
    return response.data;
  },
};
