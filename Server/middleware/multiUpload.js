const multer = require('multer');

const multiUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB per image
    files: 3 // max 3 files
  },
   fileFilter: (req, file, cb) => {
    console.log("Received file type:", file.mimetype);

    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }

    cb(null, true); 
  }
});

module.exports = multiUpload; // Export the configured multer instance