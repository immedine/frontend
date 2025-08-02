import axiosInstance from '@/lib/axios/axios.interceptor';
import axios from 'axios';
import { toast } from 'sonner';

const CATEGORY_API = '/category';

export interface Category {
  _id: string;
  name: string;
  order: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleCategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoryResponse {
  success: boolean;
  data: {
    data: Category[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddCategoryData {
  name: string;
  order: number;
}

export interface CategoryListParams {
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

export const categoryService = {
  getCategories: async (params: CategoryListParams, userType: string) => {
    const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<CategoryResponse>(
      `/account/${userType}${CATEGORY_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addCategory: async (data: AddCategoryData, userType: string) => {
    const response = await axiosInstance.post(`/account/${userType}${CATEGORY_API}/add`, data);
    if (response.data) {
      toast.success('Category added successfully');
      return true;
    } else {
      return false;
    }
  },

  updateCategory: async (id: string, data: AddCategoryData, userType: string) => {
    const response = await axiosInstance.put<SingleCategoryResponse>(
      `/account/${userType}${CATEGORY_API}/${id}`,
      data
    );
    if (response.data) {
      toast.success('Category updated successfully');
      return true;
    } else {
      return false;
    }
  },

  getCategory: async (id: string, userType: string) => {
    const response = await axiosInstance.get<SingleCategoryResponse>(
      `/account/${userType}${CATEGORY_API}/${id}`
    );
    return response.data;
  },

  deleteCategory: async (id: string, userType: string) => {
    const response = await axiosInstance.delete(`/account/${userType}${CATEGORY_API}/${id}`);
    if (response.data) {
      toast.success('Category deleted successfully');
      return true;
    } else {
      return false;
    }
  },

  getCategoriesFromApp: async (params, userType) => {
      // const { skip = 0, limit = 0, filters = {}, sortConfig = {} } = params;
  
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/category/list?skip=0&limit=0`,
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
};
