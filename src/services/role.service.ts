import axiosInstance from '@/lib/axios/axios.interceptor';

const ROLE_API = '/account/admin/role';

export interface Role {
  _id: string;
  permissions: {
    moduleKey: string,
    moduleName: string,
    role: number
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SingleRoleResponse {
  success: boolean;
  data: Role;
}

export interface RoleResponse {
  success: boolean;
  data: {
    data: Role[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddRoleData {
  name: string;
  permissions: {
    moduleKey: string,
    moduleName: string,
    role: number
  }[];
}

export interface RoleListParams {
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

export const roleService = {
  getRoles: async (params: RoleListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<RoleResponse>(
      `${ROLE_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addRole: async (data: AddRoleData) => {
    const response = await axiosInstance.post(`${ROLE_API}/add`, data);
    return response.data;
  },

  updateRole: async (id: string, data: AddRoleData) => {
    const response = await axiosInstance.put<SingleRoleResponse>(
      `${ROLE_API}/${id}`,
      data
    );
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await axiosInstance.get<SingleRoleResponse>(
      `${ROLE_API}/${id}`
    );
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await axiosInstance.delete(`${ROLE_API}/${id}`);
    return response.data;
  }
};
