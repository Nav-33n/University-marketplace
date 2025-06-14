const express = require('express');
const router = express.Router();


const authController = require('../controllers/authControllers');

const protect = require('../middleware/authMiddleware');

router.post('/register', authController.registerUser); // Route for user registration
router.post('/login', authController.loginUser); // Route for user login

router.get('/profile', protect, authController.getUserProfile); // Route to get user profile, protected by middleware

module.exports = router; // Export the router to be used in the main server file

 