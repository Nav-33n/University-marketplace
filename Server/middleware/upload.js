const multer = require('multer');

// Store uploaded files in memory (as Buffer, for Supabase)
const storage = multer.memoryStorage();

// Set up multer
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // ✅ Max 1MB
  },
  fileFilter: (req, file, cb) => {
    console.log("Received file type:", file.mimetype);

    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }

    cb(null, true); // ✅ Accept the file
  }
});

module.exports = upload;
