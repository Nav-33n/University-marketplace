const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResetEmail = require('../utils/email');
const crypto = require('crypto-browserify');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role || 'user', // Default to 'user' if role is not set
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check the username
    const nameRegex = /^[a-zA-Z ]+$/;
    console.log(username)
    // Check if user already exists
    const existingUser = await User.findOne({
  $or: [{ email }, { username }]
});


if (existingUser) {
  if (existingUser.email === email) {
    return res.status(400).json({ message: 'Email is already registered' });
  }
  if (existingUser.username === username) {
    return res.status(400).json({ message: 'Username is already taken' });
  }
}

if (!nameRegex.test(username)) {
  return res.status(400).json({ message: 'Please Use Valid Name' });
}
if (!username || username.length < 3 || username.length > 50) {
  return res.status(400).json({ message: 'Name must be between 3 and 50 characters long' });
}

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //generate token for new user to automatic login
    const token = generateToken(newUser)

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Generate JWT
    const token = generateToken(existingUser);

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Login failed' });
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`; //This link will sent token to Frontend for token extraction
  
  await sendResetEmail(user.email, resetLink);

  res.json({ message: 'Reset email sent successfully' });
};

exports.resetPassword = async (req, res) => {
  const { token, email } = req.query;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json({ message: 'Password has been reset successfully' });
};