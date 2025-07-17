import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import default_Image from '../../../assets/default_Avatar.png';
import api from '../../../services/api';

export default function ProfileImageUpload({ userToken}) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);   
  
  useEffect(() => {
    const fetchProfileImage = async () => {
      
      const cachedImage = localStorage.getItem('profilePhoto');
      if(cachedImage) {
        setImage(cachedImage);
        return;
      }

      try {
        const res = await api.get('/users/profile', {
          headers:{
            Authorization: `Bearer ${userToken}`,
          },
        });
        const profilePhoto = res.data.profilePhoto || default_Image; 
        setImage(profilePhoto);
        localStorage.setItem('profilePhoto', profilePhoto);
      } catch (err) {
        console.error('Failed to load profile image:', err);
        setImage(default_Image);
      }
    }

    fetchProfileImage();
  }, [userToken]);

  const handleImageChange = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple uploads while loading
    setLoading(true);

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
    setImage(res.data.profilePhoto);
    localStorage.setItem('profilePhoto', res.data.profilePhoto)
    } catch (error) {
      alert('Failed to upload profile image. Please try again.');
      console.error('Error uploading profile image:', error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="relative w-13 h-13 mr-2">
      {/* Circular profile preview */}
      <label htmlFor="profile-upload" className="block w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-sm cursor-pointer">
        <img
          src={image || default_Image}
          alt="Profile"
          className="w-full h-full object-cover rounded-md"
        />
        {/* Hidden input */}
        <input
          id="profile-upload"
          type="file"
          disabled={loading}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {loading &&  (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full z-10">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>       
         )}
      </label>
    </div>
  );
}
