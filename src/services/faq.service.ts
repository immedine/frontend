import axiosInstance from '@/lib/axios/axios.interceptor';

const FAQ_API = '/account/admin/faq';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleFAQResponse {
  success: boolean;
  data: FAQ;
}

export interface FAQResponse {
  success: boolean;
  data: {
    data: FAQ[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface AddFAQData {
  question: string;
  answer: string;
}

export interface FAQListParams {
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

export const faqService = {
  getFAQs: async (params: FAQListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<FAQResponse>(
      `${FAQ_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  addFAQ: async (data: AddFAQData) => {
    const response = await axiosInstance.post(`${FAQ_API}/add`, data);
    return response.data;
  },

  updateFAQ: async (id: string, data: AddFAQData) => {
    const response = await axiosInstance.put<SingleFAQResponse>(
      `${FAQ_API}/${id}`,
      data
    );
    return response.data;
  },

  getFAQ: async (id: string) => {
    const response = await axiosInstance.get<SingleFAQResponse>(
      `${FAQ_API}/${id}`
    );
    return response.data;
  },

  deleteFAQ: async (id: string) => {
    const response = await axiosInstance.delete(`${FAQ_API}/${id}`);
    return response.data;
  }
};
