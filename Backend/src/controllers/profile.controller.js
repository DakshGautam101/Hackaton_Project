import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { username, email, phone, bio, imageUrl, businessName, businessType, location } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (imageUrl) user.imageUrl = imageUrl;
    if (businessName) user.businessName = businessName;
    if (businessType) user.businessType = businessType;
    if (location) user.location = location;
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }
    
    // Find user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user achievements and stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // In a real app, you would fetch actual stats from various collections
    // For now, we'll return mock data
    const stats = {
      totalSavings: 45230,
      poolsJoined: 12,
      ordersPlaced: 48,
      rating: 4.8,
      achievements: [
        { title: 'Super Saver', description: 'Saved over ₹40,000', icon: '🏆', earned: true },
        { title: 'Community Leader', description: 'Organized 5+ pools', icon: '👑', earned: true },
        { title: 'Early Adopter', description: 'Joined in first 100 users', icon: '🌟', earned: true },
        { title: 'Bulk Buyer', description: 'Placed 50+ orders', icon: '📦', earned: false },
        { title: 'Review Master', description: 'Left 25+ reviews', icon: '⭐', earned: false },
        { title: 'Referral Champion', description: 'Referred 10+ vendors', icon: '🎯', earned: false }
      ]
    };
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user activity feed
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // In a real app, you would fetch actual activities from various collections
    // For now, we'll return mock data
    const activities = [
      {
        id: 1,
        type: 'pool_joined',
        title: 'Joined Fresh Vegetables Pool',
        description: 'Committed 25kg for bulk vegetable order',
        date: '2023-07-24T10:30:00Z',
        amount: 625
      },
      {
        id: 2,
        type: 'order_completed',
        title: 'Spices Order Delivered',
        description: 'Received turmeric and chili powder',
        date: '2023-07-21T08:45:00Z',
        amount: 1200
      },
      {
        id: 3,
        type: 'savings',
        title: 'Monthly Savings Milestone',
        description: 'Achieved ₹5,000 savings this month',
        date: '2023-07-19T16:20:00Z',
        amount: 5000
      },
      {
        id: 4,
        type: 'pool_created',
        title: 'Created Packaging Pool',
        description: 'Organized bulk order for food containers',
        date: '2023-07-12T14:15:00Z',
        amount: 800
      }
    ];
    
    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: error.message });
  }
};
