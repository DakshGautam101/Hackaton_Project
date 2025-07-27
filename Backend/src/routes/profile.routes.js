import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  getUserStats, 
  getUserActivity 
} from '../controllers/profile.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

// All profile routes require authentication
router.use(protectRoute);

// Get user profile
router.get('/', getUserProfile);

// Update user profile
router.put('/', updateUserProfile);

// Change password
router.post('/change-password', changePassword);

// Get user achievements and stats
router.get('/stats', getUserStats);

// Get user activity feed
router.get('/activity', getUserActivity);

export default router;
