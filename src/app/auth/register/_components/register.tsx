'use client';

import { useEffect, useState } from 'react';
import AuthLayout from '../../_components/auth-layout';
import { usePathname, useRouter } from 'next/navigation';
import { getPathName } from '@/lib/utils';
import RestaurantForm from '@/app/restaurant-details/_components/RestaurantForm';
import OwnerForm from './OwnerForm';
import { authService } from '@/services/auth.service';
import { REGISTRATION_DATA } from '@/config/cookie-keys';

export default function Register() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState(1);
  const [restaurantData, setRestaurantData] = useState({});
  const [ownerData, setOwnerData] = useState({});

  const onSubmit = async (values: FormValues) => {
    const reqBody = {
      ownerDetails: {
        ...values,
        fullName: restaurantData.name,
        phone: {
          countryCode: 'IN',
          number: values.phoneNumber || ""
        }
      },
      restaurantDetails: restaurantData
    };
    if (ownerData?.socialId) {
      reqBody.socialId = ownerData.socialId;
      reqBody.provider = ownerData.provider;
    }
    setOwnerData(values);

    const res = await authService.register(reqBody, getPathName(pathname));
    if (res) {
      sessionStorage.removeItem(REGISTRATION_DATA);
      router.push(`${getPathName(pathname, true)}/auth/sign-in`);
    } else {
      setCurrentView(1);
    }
  }

  const onRestaurantFormSubmit = (values: FormValues) => {
    // console.log("onRestaurantFormSubmit ", values);
    setRestaurantData(values);

    setCurrentView(2);
  }

  useEffect(() => {
    const sessionValue = sessionStorage.getItem(REGISTRATION_DATA);
    if (sessionValue) {
      setOwnerData(JSON.parse(sessionValue));
    }
  }, []);

  return (
    <AuthLayout
      title="Create Account"
      description="Fill in the details to create your account"
    >
      {currentView === 1 ? <RestaurantForm 
        isRegister={true}
        onsubmit={onRestaurantFormSubmit}
        restaurantData={restaurantData}
      /> : null}
      {currentView === 2 ? <OwnerForm 
        setCurrentView={setCurrentView}
        ownerData={ownerData}
        onsubmit={onSubmit}
      /> : null}
    </AuthLayout>
  );
}
