import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate request body
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, email, and password.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists.',
      });
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Return response without password
    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while registering user.',
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & login
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while logging in.',
      error: error.message,
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/users/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully.',
    });
  } catch (error) {
    console.error('Error in logoutUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while logging out.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all users (excluding passwords)
 * @route   GET /api/users
 * @access  Public
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching users.',
      error: error.message,
    });
  }
};
