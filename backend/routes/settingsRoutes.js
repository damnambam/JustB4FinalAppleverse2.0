// settingsRoutes.js - Add this to your backend routes folder

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Assuming you have User and Admin models
// const User = require('../models/User');
// const Admin = require('../models/Admin');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ========================
// UPDATE USER PROFILE
// ========================
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, dob } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // Validate inputs
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and email are required.' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format.' 
      });
    }

    // Find and update user in appropriate collection
    let updatedUser;
    if (isAdmin) {
      // Update in Admin collection
      updatedUser = await Admin.findByIdAndUpdate(
        userId,
        { name, email, dob },
        { new: true, runValidators: true }
      ).select('-password');
    } else {
      // Update in User collection
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, dob },
        { new: true, runValidators: true }
      ).select('-password');
    }

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile. Please try again.' 
    });
  }
});

// ========================
// CHANGE PASSWORD
// ========================
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required.' 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters long.' 
      });
    }

    // Find user in appropriate collection
    let user;
    if (isAdmin) {
      user = await Admin.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to change password. Please try again.' 
    });
  }
});

// ========================
// GET USER PROFILE
// ========================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // Find user in appropriate collection
    let user;
    if (isAdmin) {
      user = await Admin.findById(userId).select('-password');
    } else {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile.' 
    });
  }
});

module.exports = router;