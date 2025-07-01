import React, { useState } from 'react';
import api from '../services/api';
import ImageUploader from '../services/ImageUploader'
import { useNavigate } from 'react-router-dom';

const AddItem = ({ userToken}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'Sell',
  });

  const [images, setImages] = useState([]); // max 3 cropped + compressed images

  const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Stationery'];
  const types = ['Sell', 'Rent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0 || images.length > 3) {
      alert('Please upload between 1 and 3 images.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append('images', img)); 

    try {
      await api.post('/items/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      });

      alert('Successfully submitted!');
      navigate('/home')
    } catch (err) {
      console.error(err);
      alert('Submission failed. Try again.');
    } 
  };

  return (
    <div className="flex flex-col">
    <form onSubmit={handleSubmit} className="justify-center flex flex-col space-y-6 p-2  rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          {formData.type === 'Rent' ? 'Price (per day)' : 'Price'}
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-md  text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 text-black border rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 text-black py-2 border rounded-md"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔌 ImageUploader component will go here */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Product Images</label>
        <div className="mt-2 text-black border rounded-md p-4">
            <ImageUploader onImagesChange={setImages} />
        </div>
      </div>

      <button
        type="submit"
        className="block bg-blue-600 hover:bg-blue-700 my-10 text-white font-semibold py-2 px-6 rounded-md"
      >
        Submit
      </button>
    </form>
    </div>
  );
};

export default AddItem;
