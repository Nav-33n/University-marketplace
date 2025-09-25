const Order = require("../models/Order");
const Item = require("../models/Item");
const User = require("../models/User");
const mongoose = require("mongoose");
const { Types } = mongoose;
const generateOtp = require("../utils/otpGenerator");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { itemId, department, place, address, phone, terms } = req.body;

    if (!itemId)
      return res.status(400).json({ message: "itemId is required." });
    if (!terms)
      return res.status(400).json({ message: "Terms must be accepted." });

    const buyer = await User.findById(req.user.id).lean();
    if (!buyer) return res.status(404).json({ message: "Buyer not found." });

    await session.withTransaction(async () => {
      // lock the item for purchase
      const item = await Item.findOneAndUpdate(
        {
          _id: itemId,
          sold: { $ne: true },
          type: "Sell",
          status: { $ne: "pending" },
        },
        { $set: { status: "pending" } },
        { new: true, session }
      ).populate({ path: "seller", select: "-password" });

      if (!item) throw new Error("ITEM_NOT_AVAILABLE");
      if (item.seller._id.toString() === req.user.id)
        throw new Error("SELF_DEAL");

      // participants
      const participants = [
        {
          id: buyer._id,
          name: buyer.username,
          email: buyer.email,
          phone: phone.toString(),
          role: "buyer",
        },
        {
          id: item.seller._id,
          name: item.seller.username,
          email: item.seller.email,
          phone: (item.seller.phone || "").toString(),
          role: "seller",
        },
      ];

      // snapshot
      const snapshot = {
        title: item.title,
        imageURL: item.imageUrls?.[0] || "",
        department,
        place,
        address,
      };

      const price = Number(item.price) || 0;

      const order = await Order.create(
        [
          {
            item: item._id,
            orderType: "purchase",
            participants,
            itemSnapshot: snapshot,
            price,
            totals: {
              subtotal: price,
              grandTotal: price,
            },
            status: "waiting-confirmation",
            terms: true,
          },
        ],
        { session }
      );

      res.status(201).json({
        message: "Order placed successfully. Awaiting OTP verification.",
        orderId: order[0]._id,
      });
    });
  } catch (err) {
    if (err.message === "ITEM_NOT_AVAILABLE")
      return res.status(400).json({ message: "Item not available." });
    if (err.message === "SELF_DEAL")
      return res.status(400).json({ message: "You cannot buy your own item." });
    console.error("createOrder error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

exports.createRental = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { itemId, department, place, address, phone, terms, totalDays } =
      req.body;

    if (!itemId)
      return res.status(400).json({ message: "itemId is required." });
    if (!terms)
      return res.status(400).json({ message: "Terms must be accepted." });
    if (!totalDays) {
      return res.status(400).json({ message: "Rental details are required." });
    }
    const renter = await User.findById(req.user.id).lean();
    if (!renter) return res.status(404).json({ message: "Renter not found." });

    await session.withTransaction(async () => {
      // locking the item for rental (don’t mark as sold)
      const item = await Item.findOneAndUpdate(
        { _id: itemId, type: "Rent", status: { $ne: "pending" } },
        { $set: { status: "pending" } },
        { new: true, session }
      ).populate({ path: "seller", select: "-password" });

      const pricePerDay = Number(item.price);
      if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
        throw new Error("INVALID_PRICE_PER_DAY");
      }
      const days = Number(totalDays);
      if (!Number.isFinite(days) || days < 1) {
        throw new Error("INVALID_TOTAL_DAYS");
      }

      if (!item) throw new Error("ITEM_NOT_AVAILABLE");
      if (item.seller._id.toString() === req.user.id)
        throw new Error("SELF_DEAL");

      const participants = [
        {
          id: renter._id,
          name: renter.username,
          email: renter.email,
          phone: phone.toString(),
          role: "renter",
        },
        {
          id: item.seller._id,
          name: item.seller.username,
          email: item.seller.email,
          phone: (item.seller.phone || "").toString(),
          role: "owner",
        },
      ];

      const snapshot = {
        title: item.title,
        imageURL: item.imageUrls?.[0] || "",
        department,
        place,
        address,
      };

      const totalPrice = pricePerDay * days;

      const order = await Order.create(
        [
          {
            item: item._id,
            orderType: "rental",
            participants,
            itemSnapshot: snapshot,
            rentalDetails: {
              pricePerDay,
              totalDays: days,
              totalPrice,
              bookingDate: new Date(),
              state: "reserved",
            },
            totals: {
              subtotal: totalPrice,
              grandTotal: totalPrice,
            },
            status: "waiting-confirmation",
            terms: true,
          },
        ],
        { session }
      );

      res.status(201).json({
        message: "Rental order placed successfully. Awaiting OTP verification.",
        orderId: order[0]._id,
      });
    });
  } catch (err) {
    if (err.message === "ITEM_NOT_AVAILABLE")
      return res
        .status(400)
        .json({ message: "Item not available for rental." });
    if (err.message === "SELF_DEAL")
      return res
        .status(400)
        .json({ message: "You cannot rent your own item." });
    console.error("createRental error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

exports.getUserPurchase = async (req, res) => {
  try {
    const orders = await Order.find({
      participants: {
        $elemMatch: { id: req.user.id, role: { $in: ["buyer", "renter"] } },
      },
    })
      .sort({ createdAt: -1 })
      .select("+otp.buyer +otp.renter +otp.expiresAt +rentalDetails")
      .lean();

    console.log("here", orders);
    const result = orders.map((o) => {
      const seller = (o.participants || []).find(
        (p) => p.role === "seller" || p.role === "owner"
      );

      return {
        _id: o._id,
        orderType: o.orderType,
        status: o.status,
        createdAt: o.createdAt,
        item: o.item,
        itemSnapshot: o.itemSnapshot,
        price: o.price,
        totals: o.totals,

        // minimal seller info (adjust as needed)
        seller: seller
          ? {
              id: seller.id,
              name: seller.name,
              email: seller.email,
              phone: seller.phone,
            }
          : null,

        rentalDetails: {
          pricePerDay: o.rentalDetails?.pricePerDay || null,
          totalDays: o.rentalDetails?.totalDays || null,
          totalPrice: o.rentalDetails?.totalPrice || null,
          bookingDate: o.rentalDetails?.bookingDate || null,
          state: o.rentalDetails?.state || null,
        },

        otp: o.otp
          ? {
              buyer: o.otp.buyer || o.otp.renter || "waiting-confirmation",
              expiresAt: o.otp.expiresAt || null,
            }
          : { buyer: "waiting-confirmation", expiresAt: null },
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      participants: {
        $elemMatch: { id: req.user.id, role: { $in: ["seller", "owner"] } },
      },
    })
      .sort({ createdAt: -1 })
      .select("+otp.seller +otp.owner +otp.expiresAt +rentalDetails")
      .lean();

    const result = orders.map((o) => {
      const buyer = (o.participants || []).find(
        (p) => p.role === "buyer" || p.role === "renter"
      );

      return {
        _id: o._id,
        orderType: o.orderType,
        status: o.status,
        createdAt: o.createdAt,
        item: o.item,
        itemSnapshot: o.itemSnapshot,
        price: o.price,
        totals: o.totals,

        // showing the buyer or renter info (the opposite side)
        buyer: buyer
          ? {
              id: buyer.id,
              name: buyer.name,
              email: buyer.email,
              phone: buyer.phone,
            }
          : null,
        rentalDetails: {
          pricePerDay: o.rentalDetails?.pricePerDay || null,
          totalDays: o.rentalDetails?.totalDays || null,
          totalPrice: o.rentalDetails?.totalPrice || null,
          bookingDate: o.rentalDetails?.bookingDate || null,
          state: o.rentalDetails?.state || null,
        },

        // OTP view for seller/owner
        otp: o.otp
          ? {
              code: o.otp.seller || o.otp.owner || "waiting-confirmation",
              expiresAt: o.otp.expiresAt || null,
            }
          : { code: "waiting-confirmation", expiresAt: null },
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status by seller
// This endpoint allows the seller to respond to an order by providing contact and delivery date
exports.updateOrderStatus = async (req, res) => {
  try {
    const { contact, deliveryDate } = req.body;
    const { id } = req.params;

    if (!contact || !deliveryDate) {
      return res
        .status(400)
        .json({ message: "Missing contact or delivery date." });
    }

    const expiresAt = deliveryDate;
    const userObjectId = Types.ObjectId.createFromHexString(req.user.id);
    const buyerOtp = generateOtp();
    const sellerOtp = generateOtp();
    const renterOtp = generateOtp();
    const ownerOtp = generateOtp();

    // Only allow seller/owner to generate, only when awaiting confirmation, and only once.
    const filter = {
      _id: id,
      status: "waiting-confirmation",
      "otp.expiresAt": { $exists: false }, // block re-generation
      participants: {
        $elemMatch: { id: userObjectId, role: { $in: ["seller", "owner"] } },
      },
    };

    const update = [
      {
        $set: {
          deliveryDate: expiresAt,
          participants: {
            $map: {
              input: "$participants",
              as: "p",
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$$p.id", userObjectId] },
                      { $in: ["$$p.role", ["seller", "owner"]] },
                    ],
                  },
                  { $mergeObjects: ["$$p", { phone: contact }] },
                  "$$p",
                ],
              },
            },
          },
          otp: {
            $cond: [
              { $eq: ["$orderType", "purchase"] },
              {
                buyer: buyerOtp,
                seller: sellerOtp,
                buyerVerified: false,
                sellerVerified: false,
                expiresAt: expiresAt,
              },
              {
                renter: renterOtp,
                owner: ownerOtp,
                renterVerified: false,
                ownerVerified: false,
                expiresAt: expiresAt,
              },
            ],
          },
          status: "meetup-set",
          updatedAt: "$$NOW",
        },
      },
    ];

    const options = {
      new: true,
      projection: {
        _id: 1,
        orderType: 1,
        status: 1,
        deliveryDate: 1,
        "otp.expiresAt": 1,
      },
    };

    const updated = await Order.findOneAndUpdate(filter, update, options);

    if (!updated) {
      return res.status(404).json({
        message:
          "Order not found, not authorized, wrong status, or OTPs already set.",
      });
    }

    // Return the two codes matching the order type
    const otpPayload =
      updated.orderType === "purchase"
        ? { buyer: buyerOtp, seller: sellerOtp }
        : { renter: renterOtp, owner: ownerOtp };

    return res.status(200).json({
      message: "Order status updated. OTPs generated.",
      orderId: updated._id,
      orderType: updated.orderType,
      status: updated.status,
      deliveryDate: updated.deliveryDate,
      otpExpiresAt: updated.otp?.expiresAt || null,
      otp: otpPayload,
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

    const order = await Order.findById(req.params.id).select(
      "+otp.buyer +otp.seller +otp.renter +otp.owner +otp.expiresAt +rentalDetails"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const caller = order.participants.find((p) => p.id.toString() === userId);
    console.log(caller);
    if (!caller) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this order" });
    }

    const isPurchase = order.orderType === "purchase";
    const myRole = caller.role; // "buyer" | "seller" | "renter" | "owner"

    // counterparty role
    let counterpartyRole;
    if (isPurchase) {
      if (myRole !== "buyer" && myRole !== "seller") {
        return res
          .status(403)
          .json({ message: "Role not permitted for this order type" });
      }
      counterpartyRole = myRole === "buyer" ? "seller" : "buyer";
    } else {
      if (myRole !== "renter" && myRole !== "owner") {
        return res
          .status(403)
          .json({ message: "Role not permitted for this order type" });
      }
      counterpartyRole = myRole === "renter" ? "owner" : "renter";
    }

    const expectedOtp = order.otp?.[counterpartyRole];
    const otpExpiry = order.otp?.expiresAt
      ? new Date(order.otp.expiresAt)
      : null;
    const now = new Date();

    if (!expectedOtp || !otpExpiry) {
      return res.status(400).json({
        message: "OTP not set yet. Wait for seller/owner to schedule meetup.",
      });
    }

    if (now > otpExpiry) {
      order.set({
        "otp.buyer": isPurchase ? generateOtp() : undefined,
        "otp.seller": isPurchase ? generateOtp() : undefined,
        "otp.renter": !isPurchase ? generateOtp() : undefined,
        "otp.owner": !isPurchase ? generateOtp() : undefined,
        "otp.buyerVerified": false,
        "otp.sellerVerified": false,
        "otp.renterVerified": false,
        "otp.ownerVerified": false,
        "otp.expiresAt": new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await order.save();
      return res.status(200).json({
        message: "OTP expired. New OTP generated with 1-day validity.",
        otpExpiresAt: order.otp.expiresAt,
      });
    }

    //Compare
    if (String(otp) !== String(expectedOtp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const myVerifiedKey =
      myRole === "buyer"
        ? "otp.buyerVerified"
        : myRole === "seller"
        ? "otp.sellerVerified"
        : myRole === "renter"
        ? "otp.renterVerified"
        : "otp.ownerVerified";

    order.set(myVerifiedKey, true);

    const allVerified =
      (isPurchase && order.otp.buyerVerified && order.otp.sellerVerified) ||
      (!isPurchase && order.otp.renterVerified && order.otp.ownerVerified);

    if (allVerified) {
      order.status = "exchange-verified";
      order.dealClosureTime = new Date(Date.now() + 10 * 60 * 1000); // 10 min window after verify
      const item = await Item.findById(order.item);

      // If purchase, mark item sold
      //this part need to improve. this will go to cron part where after updating status
      //it also update rent start and rentend for rental
      if (isPurchase) {
        item.sold = true;
        item.status = "sold";
        await item.save();
      } else {
        const rentEnd = new Date();
        rentEnd.setHours(23, 59, 59, 999);
        rentEnd.setDate(rentEnd.getDate() + order.rentalDetails.totalDays);

        order.rentalDetails.rentStart = new Date();
        order.rentalDetails.rentEnd = rentEnd;
        order.rentalDetails.state = "picked_up";

        item.status = "Reserved";
        await item.save();
      }
    } else {
      order.status = "exchange-initiated";
    }

    await order.save();

    return res.json({
      message: `${myRole} verification captured`,
      status: order.status,
      myRole,
      counterpartyRole,
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
