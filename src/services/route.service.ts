import axiosInstance from '@/lib/axios/axios.interceptor';

const ROUTE_API = '/account/admin/route';

export interface Route {
  _id: string;
  name: string;
  cityRef: string;
  fullAddress: string;
  images: string[];
  storyPoints: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
  }>;
  status: number;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SingleRouteResponse {
  success: boolean;
  data: Route;
}

export interface RouteResponse {
  success: boolean;
  data: {
    data: Route[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddRouteData {
  name: string;
  cityRef: string;
  fullAddress: string;
  images: string[];
  storyPoints: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
  }>;
  isRecommended?: boolean;
}

export interface RouteListParams {
  skip: number;
  limit: number;
  filters?: {
    name?: string;
    cityRef?: string;
    uniqueId?: string;
  };
  sortConfig?: {
    name?: 'asc' | 'desc';
  };
}

export const routeService = {
  getRoutes: async (params: RouteListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<RouteResponse>(
      `${ROUTE_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  getRoutesBySortAndFilter: async (params: RouteListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<RouteResponse>(
      `${ROUTE_API}/list-with-sort?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addRoute: async (data: AddRouteData) => {
    const response = await axiosInstance.post(`${ROUTE_API}/add`, data);
    return response.data;
  },

  updateRoute: async (id: string, data: AddRouteData) => {
    const response = await axiosInstance.put<SingleRouteResponse>(
      `${ROUTE_API}/${id}`,
      data
    );
    return response.data;
  },

  getRoute: async (id: string) => {
    const response = await axiosInstance.get<SingleRouteResponse>(
      `${ROUTE_API}/${id}`
    );
    return response.data;
  },

  deleteRoute: async (id: string) => {
    const response = await axiosInstance.delete(`${ROUTE_API}/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: number) => {
    const response = await axiosInstance.patch<SingleRouteResponse>(
      `${ROUTE_API}/${id}/status`,
      { status }
    );
    return response.data;
  },

  updateRecommendation: async (id: string, isRecommended: boolean) => {
    const response = await axiosInstance.patch<SingleRouteResponse>(
      `${ROUTE_API}/${id}/recommend`,
      { isRecommended }
    );
    return response.data;
  }
};
