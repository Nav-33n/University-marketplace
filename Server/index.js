const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS to allow requests from frontend (e.g., React app)
app.use(express.json()); // Parse incoming JSON data in request bodies

// Import routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Test route to confirm backend is working and responding
app.get('/api/connection', (req, res) => {
    res.json({ message: 'Connection successful' });
    });

// Start the server and listen on the specified port
// Logs a message to confirm the backend is running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
