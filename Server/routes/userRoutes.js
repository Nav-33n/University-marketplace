const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware'); 
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const uploadController = require('../controllers/uploadControllers')
const upload = require('../middleware/upload');


router.get('/profile', protect, userController.getUserProfile); // Get current user's profile
router.get('/', protect, isAdmin, userController.getAllUsers); // Get all users (admin only)
router.delete('/:id', protect, isAdmin, userController.deleteUser); // Get user by ID (admin only)
router.put('/profile', protect, userController.updateCurrentUser); // Update current user's profile
router.post('/profile/upload', protect, upload.single('image'), uploadController.uploadProfileImage); // Upload profile image

module.exports = router; 