const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, itemController.createItem); // Create a new item

router.get('/', itemController.getAllItems); // Get all items

router.get('/:id', itemController.getItemById); // Get a single item by ID

router.put('/:id', protect, itemController.updateItem); // Update an item by ID

router.delete('/:id', protect, itemController.deleteItem); // Delete an item by ID

module.exports = router; // Export the router to be used in the main app file