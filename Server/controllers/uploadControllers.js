const supabase = require('../utils/supabaseClient');
const Item = require('../models/Item');
const User = require('../models/User');

exports.uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const oldImageUrl = user.profilePhoto;

     if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;


    
    const { error: uploadError } = await supabase.storage
      .from('profile-image') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

     if (uploadError) {
      console.error("Supabase upload error:", error.message);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const newImageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profile-image/${fileName}`;

    // Delete old image if it exists
   if (oldImageUrl) {
  const oldPath = oldImageUrl
    .split('/storage/v1/object/public/profile-image/')[1]; 

  if (oldPath) {
    const { error: removeError } = await supabase.storage
      .from('profile-image')
      .remove([oldPath]);

    if (removeError) {
      console.error("Failed to delete old image from Supabase:", removeError.message);
    } else {
      console.log("Successfully deleted old image from Supabase:", `profile-image/${oldPath}`);
    }
  } else {
    console.warn("Could not extract old image path from URL.");
  }
}

    user.profilePhoto = newImageUrl;
    await user.save();
    

    res.status(200).json({ message: 'Profile image updated', profilePhoto: newImageUrl, user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};
