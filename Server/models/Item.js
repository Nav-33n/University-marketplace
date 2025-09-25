const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Furniture",
        "Clothing",
        "Books",
        "Stationery",
        "Other",
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ["Sell", "Rent", "Wanted"],
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "available",
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
