const Rental = require("../models/rental");
const Item = require("../models/Item");

// const diffDays = (a, b) => {
//   const s = new Date(a);
//   s.setHours(0, 0, 0, 0);
//   const e = new Date(b);
//   e.setHours(0, 0, 0, 0);
//   return Math.floor((e - s) / 86400000) + 1;
// };

// async function hasOverlap({ itemId, start, end, excludeId = null }) {
//   const q = {
//     item: new mongoose.Types.ObjectId(itemId),
//     status: { $in: ACTIVE_STATES },
//     $and: [
//       { rentStart: { $lte: end } }, // existing starts before new ends
//       { rentEnd: { $gte: start } }, // existing ends after new starts
//     ],
//   };
//   if (excludeId) q._id = { $ne: excludeId };
//   const hit = await Rental.findOne(q).lean();
//   return !!hit;
// }

exports.createRental = async (req, res) => {
  try {
    const { itemId, totalDays, department, place, address, phone, terms } =
      req.body;

    console.log("Creating rental with data:", req.body);

    const userId = req.user.id;
    console.log(userId);
    const item = await Item.findById(itemId)
      .populate("user")
      .select("-password");

    console.log("Found item:", item);

    if (!item || item.type !== "Rent") {
      return res.status(400).json({ message: "Item not available for rent" });
    }

    if (item.user.toString() === userId) {
      return res.status(400).json({ message: "You cannot rent your own item" });
    }

    // Calculate duration and cost
    // const bookingDate = new Date();
    // const start = new Date(rentStart);
    // const end = new Date(rentEnd);

    // console.log(start, end);
    // const days = diffDays(rentStart, rentEnd);
    console.log(totalDays);
    if (totalDays > 7) {
      return res.status(400).json({ message: "Max rental is 7 days" });
    }
    const pricePerDay = item.price;
    const totalPrice = totalDays * pricePerDay;

    // Create rental record
    const newRental = new Rental({
      item: item.id,
      owner: {
        id: item.user,
        name: item.user.username,
        email: item.user.email,
      },
      renter: { id: userId, name: req.user.username, email: req.user.email },
      itemTitle: item.title,
      itemImageURL: item.imageUrls[0],
      bookingDate,
      totalDays: totalDays,
      pricePerDay,
      totalPrice,
      terms: terms,
      status: "waiting-confirmation",
    });
    await newRental.save();
    item.status = "pending";
    await item.save();
    res.status(201).json({
      message: "Rental created successfully",
      newRental,
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getMyRentals = async (req, res) => {
//     try {
//         const rentals = await Rental.find({ renter: req.user.id })
//         .populate('item', 'title imageUrl')
//         .sort({rentStart: -1});

//         res.json(rentals);
//         console.log('Fetched rentals:', rentals);
//     } catch (error) {
//         console.error('Error fetching rentals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// exports.completeRental = async (req, res) => {
//     try {
//         const rental = await Rental.findById(req.params.id);
//         console.log('Completing rental:', rental);
//         if(!rental || rental.owner.toString() !== req.user.id) {
//             return res.status(403).json({ message: 'Rental not found or unauthorized' });
//         }

//         rental.status = 'completed';
//         await rental.save();

//         res.json({ message: 'Rental completed successfully', rental });
// } catch(error) {
//     console.error('Error completing rental:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.cancelRental = async (req, res) => {
//     try {
//         const rental = await Rental.findById(req.params.id);

//         if(!rental || rental.renter.toString() !== req.user.id) {
//             return res.status(403).json({ message: 'Rental not found or unauthorized' });
//         }

//         // Only allow cancel if rental is still active and in future
//     const now = new Date();
//     if (rental.rentStart <= now) {
//       return res.status(400).json({ message: 'Rental already started' });
//     }

//     rental.status = 'cancelled';
//     await rental.save();

//     res.json({ message: 'Rental cancelled successfully', rental });
//     } catch (error) {
//         console.error('Error cancelling rental:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
