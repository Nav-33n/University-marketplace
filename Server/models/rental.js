// const mongoose = require("mongoose");

// const rentalSchema = new mongoose.Schema(
//   {
//     item: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Item",
//       required: true,
//     },
//     owner: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//       name: String,
//       email: String,
//       phone: Number,
//     },
//     renter: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//       name: String,
//       email: String,
//       phone: Number,
//     },
//     itemTitle: String,
//     itemImageURL: String,

//     department: String,
//     place: String,
//     address: String,

//     otp: {
//       owner: String,
//       renter: String,
//       buyerVerified: { type: Boolean, default: false },
//       sellerVerified: { type: Boolean, default: false },
//       expiresAt: Date,
//     },
//     bookingDate: {
//       type: Date,
//       default: Date.now,
//     },

//     rentStart: {
//       type: Date,
//     },
//     rentEnd: {
//       type: Date,
//     },
//     pricePerDay: {
//       type: Number,
//       required: true,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     totalDays: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: [
//         "waiting-confirmation",
//         "meetup-set",
//         "exchange-initiated",
//         "exchange-verified",
//         "Rental-Started",
//         "Rental-Completed",
//         "cancelled",
//       ],
//       default: "waiting-confirmation",
//     },
//     terms: {
//       type: Boolean,
//       required: true,
//     },
//     dealClosureTime: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Rental", rentalSchema);
