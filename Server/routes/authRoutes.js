const express = require('express');
const router = express.Router();

const { 
    registerUser,
     loginUser, 
     getUserProfile } = require('../controllers/authController');

const protect = require('../middleware/authMiddleware');

router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser); // Route for user login

router.get('/profile', protect, getUserProfile); // Route to get user profile, protected by middleware

module.exports = router; // Export the router to be used in the main server file

