const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserPurchase,
  getSellerOrders,
  updateOrderStatus,
  verifyOtp,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder); // Route to create a new order
router.get("/purchase", protect, getUserPurchase); //Route to get user purchase
router.get("/seller", protect, getSellerOrders); // Route to get seller orders

router.post("/update/:id", protect, updateOrderStatus); // Route to update order status
router.post("/verify-otp/:id", protect, verifyOtp);

module.exports = router;
