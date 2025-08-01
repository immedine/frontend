"use client";

// components/RestaurantForm.jsx

import { useState } from 'react';

export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    intro: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle upload logic here
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
