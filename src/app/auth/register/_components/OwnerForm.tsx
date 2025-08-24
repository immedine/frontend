"use client";

import { Button } from '@/components/ui/button';
import { getPathName, isValid } from '@/lib/utils';
import { restaurantOwnerService } from '@/services/restaurant-owner.service';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// components/RestaurantForm.jsx

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function OwnerForm({
  ownerData,
  onsubmit,
  fromAdmin,
  setAdded,
  restaurants
}) {
  const pathname = usePathname();
  const [formError, setFormError] = useState({});

  const [formData, setFormData] = useState({
    // firstName: '',
    // lastName: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (ownerData && Object.keys(ownerData).length && !restaurants) {
      setFormData({
        // firstName: ownerData.firstName,
        // lastName: ownerData.lastName,
        email: ownerData.email,
        phoneNumber: ownerData.phoneNumber,
        password: ownerData.password,
        confirmPassword: ownerData.confirmPassword
      });
    }
  }, [ownerData]);

  useEffect(() => {
    if (restaurants && restaurants.length && ownerData && Object.keys(ownerData).length) {
      console.log("ownerData ", ownerData)
      setFormData({
        ...formData,
        restaurantRef: ownerData.restaurantRef ? ownerData.restaurantRef : restaurants[0]._id,
        email: ownerData.email,
        phoneNumber: ownerData.phoneNumber,
        fullName: ownerData.fullName,
      });
    }
  }, [restaurants]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setFormError((prev) => {
      return {
        ...prev,
        [name]: ""
      }
    })
  };

  const submitForm = async (data: any) => {

    const res = await restaurantOwnerService.addRestaurantOwnerFromAdmin({
      personalInfo: {
        fullName: data.fullName,
        email: data.email,
        phone: {
          countryCode: 'IN',
          number: data.phoneNumber || ""
        }
      },
      restaurantRef: data.restaurantRef
    }, getPathName(pathname));
    if (res) {
      toast.success("Owner added successfully!");
      setAdded();
    }
  };

  const handleSubmit = async (e) => {
    const reqFields = {
      email: true,
      phoneNumber: true,
    };

    if (!ownerData?.socialId && !fromAdmin) {
      reqFields.password = true;
      reqFields.confirmPassword = true;
    }

    if (fromAdmin) {
      reqFields.fullName = true;
    }

    e.preventDefault();
    if (!isValid({
      requiredFields: reqFields,
      formError,
      formDetails: formData,
      updateError: setFormError
    })) {
      return;
    }

    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      setFormError((prev) => ({
        ...prev,
        phoneNumber: "Mobile number must be at least 10 digits"
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }));
      return;
    }

    // Handle upload logic here
    // console.log(formData);
    !fromAdmin && onsubmit(formData);

    fromAdmin && submitForm(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 `}
    >
      {fromAdmin ?
        <div>
          <div>
            <label className="block mb-1 font-medium">Select Restaurant</label>
            <select
              value={formData.restaurantRef}
              onChange={handleChange}
              name='restaurantRef'
              className={`w-full border rounded px-3 py-2 border-gray-300`}>
              {restaurants.map(eachRes => {
                return <option key={eachRes._id} value={eachRes._id}>{eachRes.name}</option>
              })}
            </select>
          </div>
          <div className='mt-2'>
            <label className="block mb-1 font-medium">Contact Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Enter full name'
              autoComplete='off'
              className={`w-full border rounded px-3 py-2
              ${formError.fullName ? 'border-red-500' : 'border-gray-300'}
              
              `}
            />
            {formError.fullName && <p className='text-red-500 text-sm mt-1'>{formError.fullName}</p>}
          </div>
          
        </div> : null}
      <div>
        <div>
          <label className="block mb-1 font-medium">Contact Email Address</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter email address'
            disabled={ownerData?.socialId}
            autoComplete='off'
            className={`w-full border rounded px-3 py-2
              ${formError.email ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.email && <p className='text-red-500 text-sm mt-1'>{formError.email}</p>}
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-1 font-medium">Contact Mobile Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={e => {
              handleChange({
                target: {
                  name: 'phoneNumber',
                  value: e.target.value.replace(/\D/, '')
                }
              })
            }}
            placeholder='Enter mobile number'
            className={`w-full border rounded px-3 py-2
              ${formError.phoneNumber ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.phoneNumber && <p className='text-red-500 text-sm mt-1'>{formError.phoneNumber}</p>}
        </div>
      </div>
      {!ownerData?.socialId && !fromAdmin ?
        <>
          <div>
            <div>
              <label className="block mb-1 font-medium">Enter Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password'
                className={`w-full border rounded px-3 py-2
              ${formError.password ? 'border-red-500' : 'border-gray-300'}
              
              `}
              />
              {formError.password && <p className='text-red-500 text-sm mt-1'>{formError.password}</p>}
            </div>
          </div>
          <div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder='Confirm password'
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2
              ${formError.confirmPassword ? 'border-red-500' : 'border-gray-300'}
              
              `}
              />
              {formError.confirmPassword && <p className='text-red-500 text-sm mt-1'>{formError.confirmPassword}</p>}
            </div>
          </div>
        </> : null}

      <>
        <Button className="w-full" type="submit">
          Submit
        </Button>
        {!fromAdmin ?
          <div className="text-center text-sm">
            <Link
              href={`${getPathName(pathname, true)}/auth/sign-in`}
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              Back to Login
            </Link>
          </div> : null}
      </>

    </form>
  );
}
