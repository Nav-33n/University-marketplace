const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadProductImage, uploadProfileImage } = require('../controllers/uploadControllers');
const protect = require('../middleware/auth');

router.post('/upload', protect, upload.array('image', 3), uploadProductImage);

module.exports = router;
