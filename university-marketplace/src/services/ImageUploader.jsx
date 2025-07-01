import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUploader = ({ onImagesChange }) => {
  const [compressedImages, setCompressedImages] = useState([]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + compressedImages.length > 3) {
      alert('You can upload up to 3 images.');
      return;
    }

    try {
      const newCompressed = await Promise.all(
        files.map((file) =>
          imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        )
      );

      const updatedList = [...compressedImages, ...newCompressed];
      setCompressedImages(updatedList);
      onImagesChange(updatedList);
    } catch (error) {
      console.error('Compression error:', error);
    }
  };

  const handleRemove = (index) => {
    const newList = [...compressedImages];
    newList.splice(index, 1);
    setCompressedImages(newList);
    onImagesChange(newList);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block"
      />

      <div className="grid grid-cols-3 gap-2">
        {compressedImages.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-full h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 text-red-600 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
