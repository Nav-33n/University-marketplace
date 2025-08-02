const Order = require("../models/Order");
const Item = require("../models/Item");
const User = require("../models/User");
const generateOtp = require("../utils/otpGenerator");

exports.createOrder = async (req, res) => {
  try {
    const { itemId, department, place, address, phone, terms } = req.body;
    const buyerUser = await User.findById(req.user.id);
    console.log("Buyer User:", buyerUser);

    const item = await Item.findById(itemId)
      .populate("user")
      .select("-password"); // seller info
    console.log("Item:", item);

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (item.sold || item.type !== "Sell") {
      return res
        .status(400)
        .json({ message: "Item is not available for sale." });
    }
    console.log("Buyer ID:", req.user.id);
    console.log("Seller ID:", item.user._id.toString());

    if (item.user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot buy your own item." });
    }

    // Create Order
    const newOrder = new Order({
      item: item._id,
      itemTitle: item.title,
      itemImageURL: item.imageUrls[0], // first image
      price: item.price,

      buyer: {
        id: buyerUser._id,
        name: buyerUser.username,
        email: buyerUser.email,
        phone: phone,
      },

      seller: {
        id: item.user._id,
        name: item.user.username,
        email: item.user.email,
      },

      department,
      place,
      address,

      status: "waiting-confirmation",
      terms: terms,
    });

    await newOrder.save();

    // need to work: mark item status to prevent duplicate buying
    item.status = "pending";
    await item.save();

    res.status(201).json({
      message: "Order placed successfully. Awaiting OTP verification.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserPurchase = async (req, res) => {
  try {
    const order = await Order.find({ "buyer.id": req.user.id }).sort({
      createdAt: -1,
    });

    // need to work on
    const filterOut = order.map((order) => {
      const o = order.toObject();

      o.otp = o.otp
        ? {
            buyer: o.otp.buyer,
            expiresAt: o.otp.expiresAt,
          }
        : {
            buyer: "waiting-confirmation",
            expiresAt: null,
          };

      return o;
    });
    res.json(filterOut);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "seller.id": req.user.id }).sort({
      createdAt: -1,
    });

    const filterOut = orders.map((order) => {
      const o = order.toObject();
      o.otp = o.otp
        ? {
            seller: o.otp.seller,
            expiresAt: o.otp.expiresAt,
          }
        : {
            seller: "Waiting-on-you",
            expiresAt: null,
          };
      return o;
    });
    res.json(filterOut);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status by seller
// This endpoint allows the seller to respond to an order by providing contact and delivery date
exports.updateOrderStatus = async (req, res) => {
  console.log("Updating order status for:", req.params.id);
  try {
    const { contact, deliveryDate } = req.body;

    if (!contact || !deliveryDate) {
      return res
        .status(400)
        .json({ message: "Missing contact or delivery date." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.seller.id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to respond to this order." });
    }

    if (order.status !== "waiting-confirmation") {
      return res
        .status(400)
        .json({ message: "Order is not awaiting seller response." });
    }

    order.seller.phone = contact;
    order.deliveryDate = deliveryDate;

    const deliveryDateObj = new Date(deliveryDate);
    deliveryDateObj.setHours(23, 59, 59, 999);

    const buyerOtp = generateOtp();
    const sellerOtp = generateOtp();

    order.otp = {
      buyer: buyerOtp,
      seller: sellerOtp,
      expiresAt: deliveryDateObj,
    };

    order.status = "meetup-set";
    order.updatedAt = Date.now();

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully.",
      otpExpriesAt: order.otp.expiresAt,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Error responding to order:", err);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(req.params.id);
    const item = await Item.findById(order.item);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const now = new Date();

    const isBuyer = order.buyer?.id?.toString() === userId;

    const isSeller = order.seller?.id?.toString() === userId;

    if (!isBuyer && !isSeller) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this order" });
    }

    const userRole = isBuyer ? "seller" : "buyer";
    const expectedOtp = order.otp?.[userRole];
    const otpExpiry = new Date(order.otp?.expiresAt);

    if (!expectedOtp || now > otpExpiry) {
      order.otp = {
        buyer: generateOtp(),
        seller: generateOtp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        buyerVerified: false,
        sellerVerified: false,
      };
      await order.save();

      return res.status(200).json({
        message: "OTP expired. New OTP generated with 1-day validity.",
        otpExpiresAt: order.otp.expiresAt,
      });
    }

    if (otp !== expectedOtp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    order.otp[`${userRole}Verified`] = true;

    if (order.otp.buyerVerified && order.otp.sellerVerified) {
      order.status = "exchange-verified";
      console.log("Both OTPs verified, marking order as exchange-verified");
      item.sold = true;
      item.status = "Sold";
      order.dealClosureTime = new Date(now.getTime() + 10 * 60000);
    } else {
      order.status = "exchange-initiated";
    }
    await item.save();
    await order.save();
    console.log(item);

    return res.json({
      message: `${userRole} OTP verified`,
      status: order.status,
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
