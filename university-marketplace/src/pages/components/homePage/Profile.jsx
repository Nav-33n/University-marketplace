import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import default_Image from '../../../assets/default_Avatar.png';
import api from '../../../services/api';

export default function ProfileImageUpload({ userToken}) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await api.get('/users/profile', {
          headers:{
            Authorization: `Bearer ${userToken}`,
          },
        });
    
        setImage(res.data.profilePhoto || default_Image); // Set default image if none exists
      } catch (err) {
        console.error('Failed to load profile image:', err);
      }
    }

    fetchProfileImage();
  }, [userToken]);

  const handleImageChange = async (e) => {
    const originalFile = e.target.files[0];
    if (!originalFile) return;

    try {
      const compressedFile = await imageCompression(originalFile, {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height in pixels
        useWebWorker: true, // Use web worker for compression
    });

    setImage(URL.createObjectURL(compressedFile));

    const formData = new FormData();
    formData.append('image', compressedFile);

    const res = await api.post('/users/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    });

    alert ('Profile image updated successfully!');
    setImage(res.data.profilePhoto);
    } catch (error) {
      alert('Failed to upload profile image. Please try again.');
      console.error('Error uploading profile image:', error);
    }
  }

  return (
    <div className="relative w-13 h-13 mr-2">
      {/* Circular profile preview */}
      <label htmlFor="profile-upload" className="block w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-sm cursor-pointer">
        <img
          src={image || default_Image}
          alt="Profile"
          className="w-full h-full object-fill rounded-2xl"
        />
        {/* Hidden input */}
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
