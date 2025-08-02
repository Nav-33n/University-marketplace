const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  buyer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: Number,
  },
  seller: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: Number,
  },
  price: Number,
  itemTitle: String,
  itemImageURL: String,
  department: String,
  place: String,
  address: String,

  otp: {
    buyer: String,
    seller: String,
    buyerVerified: { type: Boolean, default: false },
    sellerVerified: { type: Boolean, default: false },
    expiresAt: Date,
  },

  status: {
    type: String,
    enum: [
      "waiting-confirmation",
      "meetup-set",
      "exchange-initiated",
      "exchange-verified",
      "dealed-closed",
      "cancelled",
    ],
    default: "waiting-confirmation",
  },

  terms: {
    type: Boolean,
    default: false,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  dealClosureTime: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
