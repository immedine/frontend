import axiosInstance from '@/lib/axios/axios.interceptor';

const STORY_API = '/account/admin/story';

export interface StoryLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface StoryLanguageDetail {
  languageRef: string;
  name: string;
  introductoryText: string;
  audioSegment?: string;
  videoSegment?: string;
}

export interface StoryOtherDetails {
  openingHours: string;
  additionalInfo: string;
  ticketPrice: string;
}

export interface StorySource {
  source: string;
  photos: string[];
  videos?: string[];
}

export interface StoryBusinessInfo {
  logo?: string;
  website: string;
  couponsDiscounts?: string;
  ticketSales?: string;
  operatingHours: string;
}

export interface Story {
  _id: string;
  uniqueId: string;
  cityRef: string;
  images: string[];
  fullAddress: {
    address: string;
    location: StoryLocation;
  };
  languageDetails: StoryLanguageDetail[];
  otherDetails: StoryOtherDetails;
  storySource: StorySource;
  businessInfo: StoryBusinessInfo;
  isNew: boolean;
  timeForNew?: string;
  categoryRefs: string[];
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddStoryData {
  uniqueId: string;
  cityRef: string;
  images: string[];
  fullAddress: {
    address: string;
    location: StoryLocation;
  };
  languageDetails: StoryLanguageDetail[];
  otherDetails: StoryOtherDetails;
  storySource: StorySource;
  businessInfo: StoryBusinessInfo;
  isNew: boolean;
  timeForNew?: string;
  categoryRefs: string[];
}

export interface StoryResponse {
  success: boolean;
  data: {
    data: Story[];
    skip: number;
    limit: number;
    total: number;
  };
}

export interface SingleStoryResponse {
  success: boolean;
  data: Story;
}

export interface StoryListParams {
  skip: number;
  limit: number;
  filters?: {
    name?: string;
    cityRef?: string;
    onlyNotHidden?: boolean;
  };
  sortConfig?: {
    name?: 'asc' | 'desc';
  };
}

export const storyService = {
  getStories: async (params: StoryListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<StoryResponse>(
      `${STORY_API}/list?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  getStoriesBySortAndFilter: async (params: StoryListParams) => {
    const { skip = 0, limit = 10, filters = {}, sortConfig = {} } = params;

    const response = await axiosInstance.post<StoryResponse>(
      `${STORY_API}/list-with-sort?skip=${skip}&limit=${limit}`,
      {
        filters,
        sortConfig
      }
    );

    return response.data;
  },

  getStoryFiles: async () => {
    const response = await axiosInstance.post<StoryResponse>(
      `${STORY_API}/excel-list`
    );

    return response.data;
  },

  addStory: async (data: AddStoryData) => {
    const response = await axiosInstance.post(`${STORY_API}/add`, data);
    return response.data;
  },

  bulkUploadStory: async (data: any) => {
    const response = await axiosInstance.post(`${STORY_API}/bulk-add`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateStory: async (id: string, data: AddStoryData) => {
    const response = await axiosInstance.put<SingleStoryResponse>(
      `${STORY_API}/${id}`,
      data
    );
    return response.data;
  },

  getStory: async (id: string) => {
    const response = await axiosInstance.get<SingleStoryResponse>(
      `${STORY_API}/${id}`
    );
    return response.data;
  },

  deleteStory: async (id: string) => {
    const response = await axiosInstance.delete(`${STORY_API}/${id}`);
    return response.data;
  }
};
