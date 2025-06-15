const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'furniture', 'clothing', 'books', 'other'] // Example categories
    },
    type: {
        type: String,
        required: true,
        enum: ['sell', 'rent', 'wanted'] // Type of item
    },
    imageUrl: {
        type: String,
        default: '' // Optional image URL for the item.  later working with Cloudinary/supabase to update or retrive 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Item', itemSchema); // Export the Item model to be used in other parts of the application