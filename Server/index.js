const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

//security middlewares
const morgan = require("morgan"); // Optional: for logging requests in development
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dealCloser = require("./cron/dealCloser");

dealCloser.start();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", apiLimiter);

// Import routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
// const rentalRoutes = require("./routes/rentalRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/rentals", rentalRoutes);
app.use("/api/orders", orderRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Test route
app.get("/api/connection", (req, res) => {
  res.json({ message: "Connection successful" });
});

// Start the server and listen on the specified port
// Logs a message to confirm the backend is running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
