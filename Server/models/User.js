const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        profilePhoto: {
            type: String,
            default: ''},
    }, {timestamps: true} // Automatically manage createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);
module.exports = User; // Export the User model to be used in other parts of the application