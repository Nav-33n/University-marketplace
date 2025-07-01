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
        enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Other'] // Example categories
    },
    type: {
        type: String,
        required: true,
        enum: ['Sell', 'Rent', 'Wanted'] // Type of item
    },
    imageUrls: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sold: {
        type: Boolean, 
        default: false}, // Indicates if the item has been sold
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User'}, // Reference to the user who bought the item, if applicable
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Item', itemSchema); // Export the Item model to be used in other parts of the application