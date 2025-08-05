"use client";
import React, { useEffect, useState } from 'react';
import { Switch } from '../switch';
import ImageGalleryUploader from '../PhotoGalleryWithUploader';
import { isValid } from '@/lib/utils';

export default function MenuForm({details, submitForm}) {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    price: '',
    isVeg: false,
    isSpicy: false,
    description: '',
    ingredients: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (details) {
      setFormData(JSON.parse(JSON.stringify(details)));
      if (details.images?.length) {
        setImages(details.images);
      }
    }
  }, [details]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData, files, images);

    if (isValid({
      requiredFields: {
        name: true,
        order: true,
        price: true,
        description: true
      },
      formError,
      formDetails: formData,
      updateError: setFormError
    })) {
      submitForm({
        ...formData,
        images: images.length ? images.filter(item => !item.includes('blob:')) : [],
      }, files);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white shadow-md rounded-xl space-y-6">
      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
              ${formError.name ? 'border-red-500' : 'border-gray-300'}
              `}
          />
          {formError.name && <p className='text-red-500 text-sm mt-1'>{formError.name}</p>}
        </div>

        {/* Order */}
        <div>
          <label className="block mb-1 font-medium">Order*</label>
          <input
            type="text"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
              ${formError.order ? 'border-red-500' : 'border-gray-300'}
              `}
          />
          {formError.order && <p className='text-red-500 text-sm mt-1'>{formError.order}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (₹)*</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
              ${formError.price ? 'border-red-500' : 'border-gray-300'}
              `}
          />
          {formError.price && <p className='text-red-500 text-sm mt-1'>{formError.price}</p>}

        </div>

        {/* Available */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Available</label>
          <Switch
            checked={formData.isAvailable}
            onCheckedChange={() => handleChange({
              target: {
                name: 'isAvailable',
                checked: !formData.isAvailable,
                type: 'checkbox'
              }
            })}
          />
        </div>

        {/* Veg */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Veg</label>
          <Switch
            checked={formData.isVeg}
            onCheckedChange={() => handleChange({
              target: {
                name: 'isVeg',
                checked: !formData.isVeg,
                type: 'checkbox'
              }
            })}
          />
        </div>

        {/* Spicy */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Spicy</label>
          <Switch
            checked={formData.isSpicy}
            onCheckedChange={() => handleChange({
              target: {
                name: 'isSpicy',
                checked: !formData.isSpicy,
                type: 'checkbox'
              }
            })}
          />
        </div>
      </div>

      {/* Description */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className="block mb-1 font-medium">Description*</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
              ${formError.description ? 'border-red-500' : 'border-gray-300'}
              `}
          />
          {formError.description && <p className='text-red-500 text-sm mt-1'>{formError.description}</p>}

        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-1 font-medium">Ingredients</label>
          <textarea
            name="ingredients"
            rows={3}
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>
      </div>

      <ImageGalleryUploader images={images} setImages={setImages} parentFiles={files} setFiles={setFiles} />

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type="submit"
          className="w-24 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
