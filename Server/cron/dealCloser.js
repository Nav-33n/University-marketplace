const { CronJob } = require("cron");
const Order = require("../models/Order");

// const formatTime = (ms) => {
//   const totalSeconds = Math.max(0, Math.floor(ms / 1000));
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
// };

// const startCountdown = (order) => {
//   const targetTime = new Date(order.dealClosureTime);

//   const countdownInterval = setInterval(async () => {
//     const now = new Date();
//     const timeLeft = targetTime - now;

//     if (timeLeft <= 0) {
//       console.log(`\n⏳ Order ${order._id} → Deal closed!`);
//       clearInterval(countdownInterval);

//       // Update DB status
//       order.status = 'dealed-closed';
//       await order.save();
//       console.log(`✅ Order ${order._id} status updated to dealed-closed`);
//       return;
//     }

//     process.stdout.write(
//       `\rOrder ${order._id} → Time left: ${formatTime(timeLeft)}`
//     );
//   }, 1000);
// };

const dealCloser = new CronJob("*/10 * * * *", async () => {
  const now = new Date();

  try {
    console.log(`[${now.toISOString()}] Checking for expired Deals...`);

    const expiredOrders = await Order.find({
      status: "exchange-verified",
      dealClosureTime: { $lte: now }, //less than or equal to current time
    });

    for (let order of expiredOrders) {
      order.status = "dealed-closed";
      await order.save();
      console.log(`Order ${order._id} marked as dealed-closed`);
    }
  } catch (err) {
    console.error("Cron error while closing deals:", err);
  }
});

module.exports = dealCloser;
