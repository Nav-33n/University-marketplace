import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../../services/api';

export default function ProductEditor({ userToken, item, onClose }) {

  const [originalData, setOriginalData] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
  })
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
  });

 const types = ['Sell', 'Rent'];

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        price: item.price,
        description: item.description,
        type: item.type,
      });
      setOriginalData({
        title: item.title,
        price: item.price,
        description: item.description,
        type: item.type,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

   const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };


  const id = item._id;
  
  const handleSubmit = async (e) => {
    e.preventDefault();


     if (!hasChanges()) {
      setMessage('Nothing changed.');
      return;
    }

    try {
      await API.put(`/items/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
       setMessage('Product updated successfully!');
        alert('Product updated successfully!')
       setOriginalData(formData);
    } catch (err) {
      console.error(err);
      console.error('Error submitting form:', err);
      setMessage('Submission failed.');
      alert('Submission failed.')
    }
    console.log('Updated Product:', formData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg border border-blue-200 relative">

          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-blue-500 hover:text-blue-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold text-blue-700 mb-4">Edit Product</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
            >
              Submit Changes
            </button>
            {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
