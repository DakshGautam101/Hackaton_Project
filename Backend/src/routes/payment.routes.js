import express from 'express';
import { createUPIOrder, verifyPayment, createWalletOrder, verifyWalletPayment } from '../controllers/payment.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

// Regular payment routes
router.post('/order', protectRoute, createUPIOrder); // Create payment order 
router.post('/create', protectRoute, createUPIOrder); // Legacy route (keep for backward compatibility)
router.post('/verify', protectRoute, verifyPayment); // Payment verification

// Wallet specific routes - temporarily removing auth for testing
router.post('/wallet/order', createWalletOrder); // Removed protectRoute for testing
router.post('/wallet/verify', protectRoute, verifyWalletPayment);

export default router;
