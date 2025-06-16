const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

router.get('/purchases', protect, itemController.getMyPurchases); // Get items purchased by the user

router.get('/sold', protect, itemController.getMySoldItems); // Get items sold by the user

router.post('/:id/buy', protect, itemController.buyItem); // Mark an item as sold

//General CRUD routes LAST
router.post('/', protect, itemController.createItem); // Create a new item

router.get('/', itemController.getAllItems); // Get all items

router.get('/:id', itemController.getItemById); // Get a single item by ID

router.put('/:id', protect, itemController.updateItem); // Update an item by ID

router.delete('/:id', protect, itemController.deleteItem); // Delete an item by ID

module.exports = router; // Export the router to be used in the main app file

