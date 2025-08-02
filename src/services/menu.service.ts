import axiosInstance from '@/lib/axios/axios.interceptor';
import axios from 'axios';
import { toast } from 'sonner';

const MENU_API = '/menu';

export interface Menu {
  _id: string;
  name: string;
  order: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleMenuResponse {
  success: boolean;
  data: Menu;
}

export interface MenuResponse {
  success: boolean;
  data: {
    data: Menu[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddMenuData {
  name: string;
  order: number;
}

export interface MenuListParams {
  skip: number;
  limit: number;
  filters?: {
    name?: string;
    type?: string;
  };
  sortConfig?: {
    name?: 'asc' | 'desc';
  };
}

export const menuService = {
  getMenus: async (params: MenuListParams, userType: string) => {
    const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<MenuResponse>(
      `/account/${userType}${MENU_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addMenu: async (data: AddMenuData, userType: string) => {
    const response = await axiosInstance.post(`/account/${userType}${MENU_API}/add`, data);
    if (response.data) {
      toast.success('Menu added successfully');
      return true;
    } else {
      return false;
    }
  },

  updateMenu: async (id: string, data: AddMenuData, userType: string) => {
    const response = await axiosInstance.put<SingleMenuResponse>(
      `/account/${userType}${MENU_API}/${id}`,
      data
    );
    if (response.data) {
      toast.success('Menu updated successfully');
      return true;
    } else {
      return false;
    }
  },

  getMenu: async (id: string, userType: string) => {
    const response = await axiosInstance.get<SingleMenuResponse>(
      `/account/${userType}${MENU_API}/${id}`
    );
    return response.data;
  },

  deleteMenu: async (id: string, userType: string) => {
    const response = await axiosInstance.delete(`/account/${userType}${MENU_API}/${id}`);
    if (response.data) {
      toast.success('Menu deleted successfully');
      return true;
    } else {
      return false;
    }
  },

  getMenusFromApp: async (params, userType) => {
    // const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axios.post(
      `http://localhost:8000/api/v1/user/menu/list?skip=0&limit=0`,
      {
        filters: {
          restaurantRef: "6881b196255b88026d76cc25"
        }
      },
      {
        headers: {
          'x-auth-deviceid': '1234',
          'x-auth-devicetype': 3
        }
      }
    );

    return response.data;
  },

  getMenuItemFromApp: async (id, userType) => {
    // const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axios.get(
      `http://localhost:8000/api/v1/user/menu/68822b165f863912dab3332f`,
      {
        headers: {
          'x-auth-deviceid': '1234',
          'x-auth-devicetype': 3
        }
      }
    );

    return response.data;
  },
};
