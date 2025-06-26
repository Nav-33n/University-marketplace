import { useState } from 'react';

// const handleProfileImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("image", file);

//   try {
//     const res = await axios.post('/api/users/upload-profile', formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${userToken}`, // If you use JWT
//       },
//     });

//     alert("Upload successful");
//     console.log(res.data.user.profileImage); // The Supabase URL
//   } catch (err) {
//     alert("Upload failed");
//     console.error(err);
//   }
// };

export default function ProfileImageUpload() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview image
    }
  };

  return (
    <div className="relative w-15 h-15 mr-2">
      {/* Circular profile preview */}
      <label htmlFor="profile-upload" className="block w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-sm cursor-pointer">
        <img
          src={image || '/default-avatar.png'}
          alt="Profile"
          className="w-full h-full object-cover"
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
