import axiosInstance from '@/lib/axios/axios.interceptor';

const SUB_ADMIN_API = '/account/admin/admin-user';

export interface SubAdmin {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  roleInfo: {
    isSuperAdmin: boolean;
    roleId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SingleSubAdminResponse {
  success: boolean;
  data: SubAdmin;
}

export interface SubAdminResponse {
  success: boolean;
  data: {
    data: SubAdmin[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddSubAdminData {
  name: string;
  permissions: {
    moduleKey: string,
    moduleName: string,
    subAdmin: number
  }[];
}

export interface SubAdminListParams {
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

export const subAdminService = {
  getSubAdmins: async (params: SubAdminListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<SubAdminResponse>(
      `${SUB_ADMIN_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addSubAdmin: async (data: AddSubAdminData) => {
    const response = await axiosInstance.post(`${SUB_ADMIN_API}/add`, data);
    return response.data;
  },

  updateSubAdmin: async (id: string, data: AddSubAdminData) => {
    const response = await axiosInstance.put<SingleSubAdminResponse>(
      `${SUB_ADMIN_API}/${id}`,
      data
    );
    return response.data;
  },

  getSubAdmin: async (id: string) => {
    const response = await axiosInstance.get<SingleSubAdminResponse>(
      `${SUB_ADMIN_API}/${id}`
    );
    return response.data;
  },

  deleteSubAdmin: async (id: string) => {
    const response = await axiosInstance.delete(`${SUB_ADMIN_API}/${id}`);
    return response.data;
  }
};
