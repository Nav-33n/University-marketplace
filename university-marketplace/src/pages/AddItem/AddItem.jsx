import { useState } from 'react';
import api from '../../services/api';
import ImageUploader from '../components/UI_services/ImageUploader';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const AddItem = ({ userToken}) => {
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setIsSubmitting(true);
    setUploadProgress(0);

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
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      alert('Successfully submitted!');
      queryClient.invalidateQueries(['items']);
      navigate('/home')
    } catch (err) {
      console.error(err);
      alert('Submission failed. Try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col bg-[#ffffff72]">
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

      <div>
        <label className="block text-sm font-medium text-gray-600">Product Images</label>
        <div className="flex mt-2 text-black rounded-md p-4 justify-center">
            <ImageUploader onImagesChange={setImages} />
        </div>
      </div>

      <button
        type="submit"
        className="block bg-blue-600 hover:bg-blue-700 my-4 text-white font-semibold py-2 px-6 rounded-md"
        disabled={isSubmitting}
      >
        Submit
      </button>

        {isSubmitting && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          </div> )}

    </form>
    </div>
  );
};

export default AddItem;
