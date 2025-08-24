import axiosInstance from '@/lib/axios/axios.interceptor';

const RESTAURANT_OWNER_API = '/restaurant-owner';

export const restaurantOwnerService = {

  getRestaurantOwners: async (params: any, userType: string) => {
    const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<any>(
      `/account/${userType}${RESTAURANT_OWNER_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addRestaurantOwnerFromAdmin: async (data: any, userType: string) => {
    const response = await axiosInstance.post<any>(
      `/account/${userType}${RESTAURANT_OWNER_API}/add`,
      data
    );
    return response.data;
  },

  getRestaurantOwnerFromAdmin: async (id: string, userType: string) => {
    const response = await axiosInstance.get<any>(
      `/account/${userType}${RESTAURANT_OWNER_API}/${id}`
    );
    return response.data;
  },

  updateRestaurantOwnerFromAdmin: async (id: string, data: any, userType: string) => {
    const response = await axiosInstance.put<any>(
      `/account/${userType}${RESTAURANT_OWNER_API}/${id}`,
      data
    );
    return response.data;
  },

  deleteRestaurantOwnerFromAdmin: async (id: string, userType: string) => {
    const response = await axiosInstance.delete<any>(
      `/account/${userType}${RESTAURANT_OWNER_API}/${id}`
    );
    return response.data;
  },
};
