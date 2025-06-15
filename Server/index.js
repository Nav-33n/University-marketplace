const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

//security middlewares
const morgan = require('morgan'); // Optional: for logging requests in development
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('dev')); // logs to console
app.use(cors()); // Enable CORS to allow requests from frontend (e.g., React app)
app.use(express.json()); // Parse incoming JSON data in request bodies

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', apiLimiter); 

// Import routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI).then(() => 
    console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if connection fails
    })

// Test route to confirm backend is working and responding
app.get('/api/connection', (req, res) => {
    res.json({ message: 'Connection successful' });
    });


// const User = require('./models/User'); // Import the User model

/* this is a test route to create a dummy user
console.log("Type of User:", typeof User);

app.get('/api/test-user', async (req, res) => {
    try {
      const dummyUser = new User({
        username: 'testuser',
        email: 'example@123.com',
        password: 'password123',});

        await dummyUser.save(); // Save the dummy user to the database
        res.json({ message: 'Dummy user created successfully', user: dummyUser });
    } catch (error) {
        console.error('Error creating dummy user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
*/


// Start the server and listen on the specified port
// Logs a message to confirm the backend is running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
