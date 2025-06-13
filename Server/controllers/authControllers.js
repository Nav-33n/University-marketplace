const bcrypt = require('bcrypt');
const { V4: {sign, verify} } = require('paseto');
const { readFileSync } = require('fs');
const path = require('path');

const user = require('../models/User');

const secretKey = readFileSync(path.join(__dirname, '../config/secret.key'), 'utf8');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existing = await user.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await user.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully'});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await user.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'Invalid email or password' }); }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        const token = await sign(
            {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
            }, secretKey,
            {expiresIn: '2h'}
        );

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Login Failed' });
    }
};

exports.getUserProfile = async (req, res) => {
    try { 
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};


