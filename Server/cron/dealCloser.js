const { CronJob } = require("cron");
const Order = require("../models/Order");

const dealCloser = new CronJob("*/10 * * * *", async () => {
  const now = new Date();

  try {
    console.log(`[${now.toISOString()}] Checking for expired Deals...`);

    const expiredOrders = await Order.find({
      $or: [
        { status: "exchange-verified", dealClosureTime: { $lte: now } },

        // Rental: period ended (status agnostic)
        { orderType: "rental", "rentalDetails.state": "picked_up" },
      ],
    });
    for (let order of expiredOrders) {
      order.status = "deal-closed";
      if (order.rentalDetails.state === "picked_up") {
        order.rentalDetails.state = "in_use";
      }
      await order.save();
      console.log(`Order ${order._id} marked as deal-closed  and saved.`);
    }
  } catch (err) {
    console.error("Cron error while closing deals:", err);
  }
});

module.exports = dealCloser;
