import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/config/cookie-keys';

interface UserData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    country?: string;
    fullName: string;
  };
  roleInfo: {
    isSuperAdmin: boolean;
  };
  settings: {
    selectedLanguage: string;
  };
  _id: string;
  accountStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export function getAuthUser(): UserData | null {
  const authData = Cookies.get(AUTH_TOKEN);
  if (!authData) return null;

  try {
    const parsedData = JSON.parse(authData) as AuthData;
    return parsedData.user;
  } catch (error) {
    return null;
  }
}
