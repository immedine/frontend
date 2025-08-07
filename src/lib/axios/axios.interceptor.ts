import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import baseUrl from './api.util';
import { DEVICE_ID, AUTH_TOKEN } from '@/config/cookie-keys';
import ApiErrorMessage from './api.errorMessage';
// Constants
const DEVICE_TYPE = 3;

// Types
interface ApiResponse {
  success: boolean;
  errorCode?: number;
  code?: number;
  data?: unknown;
}

// Helper functions
const getDeviceId = (): string => {
  let deviceId = Cookies.get(DEVICE_ID);
  if (!deviceId) {
    deviceId = uuidv4();
    Cookies.set(DEVICE_ID, deviceId);
  }
  return deviceId;
};

const getToken = (): string => {
  const authData = Cookies.get(AUTH_TOKEN);
  if (!authData) return '';

  try {
    const parsedData = JSON.parse(authData);
    return parsedData.accessToken;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return '';
  }
};

const handleClientRedirect = (path: string) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};
// Axios instance creation
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-auth-deviceid': getDeviceId(),
    'x-auth-devicetype': DEVICE_TYPE
  },
  withCredentials: false
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (!response.data.success) {
      console.log('Response data not successful:', response.data);
      handleErrorResponse(response.data);
      return Promise.resolve(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);

    if (error.response) {
      console.log('Error response data:', error.response.data);
      handleErrorResponse(error.response.data as ApiResponse);
    }

    return Promise.resolve(error);
  }
);

// Error handling
const handleErrorResponse = (errorData: ApiResponse) => {
  const errorCode = errorData?.errorCode;
  console.log(errorCode);

  if (errorCode === 1000) {
    console.log('Unauthorized access detected - redirecting to sign-in');
    Cookies.remove(AUTH_TOKEN);
    handleClientRedirect('/auth/sign-in');
    return;
  }

  const errorMessage =
    ApiErrorMessage[errorCode as keyof typeof ApiErrorMessage];
  console.log('a', errorMessage);

  if (errorMessage) {
    console.log('Showing error toast for error code:', errorCode);
    toast.error(errorMessage);
  } else {
    console.log('No matching error message found for error code:', errorCode);
  }
};

export default axiosInstance;
