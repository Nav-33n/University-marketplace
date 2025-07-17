import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { cropFile } from '../utils/cropImageHelper';

const ImageCropper = ({ file, onCancel, onDone, aspectRatio = 3 / 4 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleDone = async () => {
        if (!croppedAreaPixels){
            console.warn('Cropping area not set. Using original image.');
            onDone(file)
            return;
        }
        try {
          setIsCropping(true)
      const cropped = await cropFile(file, croppedAreaPixels);
      onDone(cropped);
    } catch (err) {
      console.error('Crop error:', err);
      onDone(file);
    } finally {
      setIsCropping(false);
    }
    };

    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    
      {isCropping ? (
        <div className="flex flex-col items-center justify-center text-grey">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xl font-semibold">Cropping...</p>
        </div>
      ) : (
        <>
        <div className="bg-white p-4 rounded-md">
          <div className="relative bg-gray-200" style={{ width: '18rem', height: '13.5rem' }}>
            <Cropper
              image={URL.createObjectURL(file)}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              disabled={isCropping}
            />
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isCropping}
              className="px-3 py-1 rounded-md bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDone}
              disabled={isCropping}
              className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50"
            >
              Crop
            </button>
          </div>
          </div>
        </>
      )}
    </div>
);
}

export default ImageCropper;