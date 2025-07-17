import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { cropToAspectRatio } from '../utils/cropImageHelper';
import ImageCropper from './ImageCropper';

const ImageUploader = ({ onImagesChange }) => {
  const [compressedImages, setCompressedImages] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [croppingFile, setCroppingFile] = useState(null);

  useEffect(() => {
    if (!croppingFile && pendingFiles.length > 0) {
      setCroppingFile(pendingFiles[0]);
      setPendingFiles((prev) => prev.slice(1));
    }
  }, [croppingFile, pendingFiles]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + compressedImages.length + pendingFiles.length > 3) {
      alert('You can upload up to 3 images.');
      return;
    }

    setPendingFiles((prev) => [...prev, ...files]);
  };

  const handleCropDone = async (file) => {
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const adjusted = await cropToAspectRatio(compressed);
      const updatedList = [...compressedImages, adjusted];

      setCompressedImages(updatedList);
      onImagesChange(updatedList);
    } catch (error) {
      console.error('Compression error:', error);
    } finally {
      setCroppingFile(null);
    }
  };

  const handleCropCancel = () => {
    setCroppingFile(null);
  };

  const handleRemove = (index) => {
    const newList = [...compressedImages];
    newList.splice(index, 1);
    setCompressedImages(newList);
    onImagesChange(newList);
  };

  return (
    <div>
      <input
        type="file"
        id="fileUpload"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={compressedImages.length >= 3}
        className="hidden"
      />

      <label
        htmlFor="fileUpload"
        className="inline-block cursor-pointer border border-teal-500 text-teal-600 px-4 py-1 rounded hover:bg-teal-50 text-[0.8em]"
      >
        Browse files
      </label>

      <div className="flex justify-start gap-4 mt-4">
        {compressedImages.map((img, idx) => (
          <div key={idx} className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt={`Preview ${idx}`}
              className="object-cover rounded w-24 h-24"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-0 right-0  rounded-full  bg-[#b7551b] text-[#ffffff] p-1.5 text-[5px]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {croppingFile && (
        <ImageCropper
          file={croppingFile}
          onDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ImageUploader;