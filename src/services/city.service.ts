import axiosInstance from '@/lib/axios/axios.interceptor';

const CITY_API = '/account/admin/city';

export interface City {
  _id: string;
  name: string;
  languageRefs: string[];
  categoryRefs: string[];
  photo: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleCityResponse {
  success: boolean;
  data: City;
}

export interface CityResponse {
  success: boolean;
  data: {
    data: City[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddCityData {
  name: string;
  languageRefs: string[];
  categoryRefs: string[];
  photo: string;
}

export interface CityListParams {
  skip: number;
  limit: number;
  filters?: {
    name?: string;
  };
  sortConfig?: {
    name?: 'asc' | 'desc';
  };
}

export interface CityBasicData {
  _id: string;
  name: string;
}

export interface CityBasicResponse {
  success: boolean;
  data: CityBasicData[];
}

export const cityService = {
  getCities: async (params: CityListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<CityResponse>(
      `${CITY_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addCity: async (data: AddCityData) => {
    const response = await axiosInstance.post(`${CITY_API}/add`, data);
    return response.data;
  },

  updateCity: async (id: string, data: AddCityData) => {
    const response = await axiosInstance.put<SingleCityResponse>(
      `${CITY_API}/${id}`,
      data
    );
    return response.data;
  },

  getCity: async (id: string) => {
    const response = await axiosInstance.get<SingleCityResponse>(
      `${CITY_API}/${id}`
    );
    return response.data;
  },

  deleteCity: async (id: string) => {
    const response = await axiosInstance.delete(`${CITY_API}/${id}`);
    return response.data;
  },

  getAllCities: async () => {
    const response = await axiosInstance.post<CityBasicResponse>(
      `${CITY_API}/list?skip=0&limit=0`
    );
    return response.data;
  }
};
