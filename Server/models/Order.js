const mongoose = require("mongoose");
const { Schema } = mongoose;

// Participant (buyer, seller, renter, owner)
const ParticipantSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: String,
    role: {
      type: String,
      enum: ["buyer", "seller", "renter", "owner"],
      required: true,
    },
  },
  { _id: false }
);

// OTP sub-schema
const OtpSchema = new Schema(
  {
    buyer: { type: String, select: false },
    seller: { type: String, select: false },
    renter: { type: String, select: false },
    owner: { type: String, select: false },
    buyerVerified: { type: Boolean, default: false },
    sellerVerified: { type: Boolean, default: false },
    renterVerified: { type: Boolean, default: false },
    ownerVerified: { type: Boolean, default: false },
    expiresAt: Date,
  },
  { _id: false }
);

// Rental-only details
const RentalDetailsSchema = new Schema(
  {
    rentStart: { type: Date },
    rentEnd: { type: Date },
    pricePerDay: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 1 },
    totalDays: { type: Number, required: true, min: 1 },
    bookingDate: { type: Date, default: Date.now },
    state: {
      type: String,
      enum: [
        "reserved",
        "picked_up",
        "in_use",
        "overdue",
        "returned",
        "settled",
      ],
      default: "reserved",
    },
  },
  { _id: false }
);

// Main Order schema
const OrderSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },

    // two participants
    participants: {
      type: [ParticipantSchema],
      validate: {
        validator: function (v) {
          if (!Array.isArray(v) || v.length !== 2) return false;
          const roles = v
            .map((p) => p.role)
            .sort()
            .join(",");
          return roles === "buyer,seller" || roles === "owner,renter";
        },
        message:
          "Participants must be exactly buyer+seller (purchase) or owner+renter (rental).",
      },
    },

    orderType: { type: String, enum: ["purchase", "rental"], required: true },

    itemSnapshot: {
      title: String,
      imageURL: String,
      department: String,
      place: String,
      address: String,
    },

    price: {
      type: Number,
      min: 1,
      required: function () {
        return this.orderType === "purchase";
      },
    },
    totals: {
      subtotal: { type: Number, min: 0 },
      grandTotal: { type: Number, min: 0 },
    },

    otp: OtpSchema,

    status: {
      type: String,
      enum: [
        // shared
        "waiting-confirmation",
        "meetup-set",
        "exchange-initiated",
        "exchange-verified",
        "deal-closed",
        "cancelled",
        // rental lifecycle
        "rental-started",
        "rental-completed",
      ],
      default: "waiting-confirmation",
    },

    deliveryDate: Date,
    dealClosureTime: Date,

    rentalDetails: {
      type: RentalDetailsSchema,
      required: function () {
        return this.orderType === "rental";
      },
    },

    terms: { type: Boolean, required: true },
    // otpExpiresAt: { type: Date, index: true },
  },
  { timestamps: true }
);

OrderSchema.pre("validate", function (next) {
  const roles = (this.participants || [])
    .map((p) => p.role)
    .sort()
    .join(",");
  if (this.orderType === "purchase" && roles !== "buyer,seller") {
    return next(new Error("Purchase must have buyer & seller participants."));
  }
  if (this.orderType === "rental" && roles !== "owner,renter") {
    return next(new Error("Rental must have owner & renter participants."));
  }

  if (
    this.participants.length === 2 &&
    this.participants[0].id.toString() === this.participants[1].id.toString()
  ) {
    return next(new Error("Buyer/owner cannot be the same as seller/renter."));
  }

  if (this.orderType === "rental" && this.rentalDetails) {
    const { rentStart, rentEnd, totalDays } = this.rentalDetails;
    if (rentStart && rentEnd && rentEnd <= rentStart) {
      return next(new Error("rentEnd must be after rentStart."));
    }
    if (totalDays && totalDays < 1) {
      return next(new Error("totalDays must be >= 1."));
    }
  }

  next();
});

OrderSchema.index({ "participants.id": 1, createdAt: -1 });
OrderSchema.index({ orderType: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ item: 1, createdAt: -1 });

OrderSchema.index({
  "participants.id": 1,
  "participants.role": 1,
  createdAt: -1,
});

module.exports = mongoose.model("Order", OrderSchema);
