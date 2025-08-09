'use client';

import { useState } from 'react';
import AuthLayout from '../../_components/auth-layout';
import { usePathname, useRouter } from 'next/navigation';
import { getPathName } from '@/lib/utils';
import RestaurantForm from '@/app/restaurant-details/_components/RestaurantForm';
import OwnerForm from './OwnerForm';
import { authService } from '@/services/auth.service';

export default function Register() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState(1);
  const [restaurantData, setRestaurantData] = useState({});
  const [ownerData, setOwnerData] = useState({});

  const onSubmit = async (values: FormValues) => {
    const reqBody = {
      ownerDetails: values,
      restaurantDetails: restaurantData
    };
    setOwnerData(values);

    // console.log("reqBody ", reqBody)
    const res = await authService.register(reqBody, getPathName(pathname));
    if (res) {
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

  return (
    <AuthLayout
      title="Create Restaurant"
      description="Fill in the details to create your own restaurant"
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
