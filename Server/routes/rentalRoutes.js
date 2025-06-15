const express = require('express');
const router = express.Router();

const rentalController = require('../controllers/rentalController');
const protect = require('../middleware/authMiddleware');

// @desc Create a rental 
router.post('/', protect, rentalController.createRental);

// @desc Get all rentals for the logged-in user
router.get('/user', protect, rentalController.getMyRentals);

// mark a rental as completed (by a owner)
router.put('/:id/complete', protect, rentalController.completeRental);

// cancel a rental (by a renter)
router.put('/:id', protect, rentalController.cancelRental);

module.exports = router;