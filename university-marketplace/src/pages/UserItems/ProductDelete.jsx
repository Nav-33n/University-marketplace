import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../../services/api';
import { Trash2 } from 'lucide-react';

export default function ProductDelete({ userToken, id, onClose }) {

     const [message, setMessage] = useState('');


     const handleDelete = async () => {
    try {
      await API.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
       setMessage('Product delete successfully!');
        alert('Product delete successfully!');
        onClose();
    } catch (err) {
      console.error(err);
      console.error('Error deleting product:', err);
      setMessage('Deletion failed.');
      alert('Deletion failed.')
      onClose();
    }
  };
    


  return (
     <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative border border-blue-100">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <Trash2 size={40} className="text-red-500 mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Item?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}