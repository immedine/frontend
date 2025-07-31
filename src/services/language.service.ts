import axiosInstance from '@/lib/axios/axios.interceptor';

const LANGUAGE_API = '/account/admin/language';

export interface Language {
  _id: string;
  name: string;
  code: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleLanguageResponse {
  success: boolean;
  data: Language;
}

export interface LanguageResponse {
  success: boolean;
  data: {
    data: Language[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddLanguageData {
  name: string;
  code: string;
}

export interface LanguageListParams {
  skip: number;
  limit: number;
  filters?: {
    name?: string;
    moduleName?: string;
  };
  sortConfig?: {
    name?: 'asc' | 'desc';
  };
}

export const languageService = {
  getLanguages: async (params: LanguageListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<LanguageResponse>(
      `${LANGUAGE_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addLanguage: async (data: AddLanguageData) => {
    const response = await axiosInstance.post(`${LANGUAGE_API}/add`, data);
    return response.data;
  },

  updateLanguage: async (id: string, data: AddLanguageData) => {
    const response = await axiosInstance.put<SingleLanguageResponse>(
      `${LANGUAGE_API}/${id}`,
      {
        name: data.name,
        code: data.code
      }
    );
    return response.data;
  },

  getLanguage: async (id: string) => {
    const response = await axiosInstance.get<SingleLanguageResponse>(
      `${LANGUAGE_API}/${id}`
    );
    return response.data;
  },

  deleteLanguage: async (id: string) => {
    const response = await axiosInstance.delete(`${LANGUAGE_API}/${id}`);
    return response.data;
  }
};
