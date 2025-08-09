"use client";

import { Button } from '@/components/ui/button';
import { getPathName, isValid } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// components/RestaurantForm.jsx

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function OwnerForm({
  ownerData,
  onsubmit
}) {
  const pathname = usePathname();
  const [formError, setFormError] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
      if (ownerData && Object.keys(ownerData).length) {
        setFormData({
          firstName: ownerData.firstName,
          lastName: ownerData.lastName,
          email: ownerData.email,
          password: ownerData.password,
          confirmPassword: ownerData.confirmPassword
        });
      }
    }, [ownerData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid({
      requiredFields: {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true
      },
      formError,
      formDetails: formData,
      updateError: setFormError
    })) {
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
    onsubmit(formData);

  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 `}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        <div>
          <label className="block mb-1 font-medium">Owner First Name*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.firstName ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.firstName && <p className='text-red-500 text-sm mt-1'>{formError.firstName}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Owner Last Name*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.lastName ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.lastName && <p className='text-red-500 text-sm mt-1'>{formError.lastName}</p>}
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-1 font-medium">Owner Email Address*</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.email ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.email && <p className='text-red-500 text-sm mt-1'>{formError.email}</p>}
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-1 font-medium">Enter Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.password ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.password && <p className='text-red-500 text-sm mt-1'>{formError.password}</p>}
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password*</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.confirmPassword ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.confirmPassword && <p className='text-red-500 text-sm mt-1'>{formError.confirmPassword}</p>}
        </div>
      </div>

      <>
        <Button className="w-full" type="submit">
          Submit
        </Button>
        <div className="text-center text-sm">
          <Link
            href={`${getPathName(pathname, true)}/auth/sign-in`}
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </>

    </form>
  );
}
