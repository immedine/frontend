"use client";

import { isValid } from '@/lib/utils';
import { restaurantService } from '@/services/restaurant.service';
import { uploadService } from '@/services/upload.service';
import { usePathname } from 'next/navigation';
// components/RestaurantForm.jsx

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function RestaurantForm() {
  const pathname = usePathname();
  const fileInputRef = useRef(null);
  const [formError, setFormError] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    intro: '',
    primaryColor: '#f5b042',
    secondaryColor: '#ffffff',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid({
      requiredFields: {
        name: true
      },
      formError,
      formDetails: formData,
      updateError: setFormError
    })) {
      return;
    }
    // Handle upload logic here
    // console.log(formData);
    let logoUrl = formData.logo;
    if (formData.logo && formData.logo instanceof File) {
      const res = await uploadService.uploadImage(formData.logo, pathname.split('/')[1]);
      logoUrl = res.data;
    }


    // return;
    const reqBody = {
      name: formData.name,
      introductoryText: formData.intro,
      primaryColor: formData.primaryColor || "",
      secondaryColor: formData.secondaryColor || ""
    }
    if (formData.logo) {
      reqBody.logo = logoUrl;
    }
    const res = await restaurantService.updateRestaurant(reqBody, pathname.split('/')[1]);
    if (res) {
      toast.success('Restaurant details updated successfully!');
    }
  };

  const fetchRestaurantDetails = async () => {
    const res = await restaurantService.getRestaurant(pathname.split('/')[1])
    if (res.data) {
      setFormData({
        name: res.data.name,
        logo: res.data.logo,
        intro: res.data.introductoryText,
        primaryColor: res.data.primaryColor,
        secondaryColor: res.data.secondaryColor,
      });
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Restaurant Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2
              ${formError.name ? 'border-red-500' : 'border-gray-300'}
              
              `}
          />
          {formError.name && <p className='text-red-500 text-sm mt-1'>{formError.name}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Logo</label>
          <button
            type='button'
            onClick={openFileDialog}
            className="w-[70px] h-[70px] flex items-center justify-center border border-dashed border-gray-400 rounded bg-gray-100 hover:bg-gray-200 text-2xl"
          >
            {formData.logo ? (
              <img
                src={typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)}
                alt="Restaurant Logo"
                className="w-full h-full object-cover rounded"
              />
            ) : '+'}
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            className="hidden"
            name="logo"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Introductory Text</label>
        <textarea
          name="intro"
          value={formData.intro}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Primary Theme Color</label>
          <input
            type="color"
            name="primaryColor"
            value={formData.primaryColor}
            onChange={handleChange}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Secondary Theme Color</label>
          <input
            type="color"
            name="secondaryColor"
            value={formData.secondaryColor}
            onChange={handleChange}
            className="w-full h-10"
          />
        </div>
      </div>
      <div className='flex justify-end'>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      </div>
    </form>
  );
}
