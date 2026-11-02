import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from '../controllers/user.controller.js';

const router = express.Router();

// User Registration route
router.post('/register', registerUser);

// User Login route
router.post('/login', loginUser);

// User Logout route
router.post('/logout', logoutUser);

// Get All Users (for testing / admin)
router.get('/', getAllUsers);

export default router;
