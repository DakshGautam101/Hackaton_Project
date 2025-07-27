import express from 'express';
import { getWallet, addFunds, spendFunds, getWalletBalance, getTransactionHistory } from '../controllers/wallet.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

// Apply auth middleware to all wallet routes
router.use(protectRoute);

// New frontend API routes
router.get('/balance', getWalletBalance);     // GET /api/wallet/balance
router.get('/transactions', getTransactionHistory); // GET /api/wallet/transactions  
router.post('/add', addFunds);   // POST /api/wallet/add - Kept but secured in controller

// Legacy routes (keep for backward compatibility)
router.get('/:userId', getWallet);           
router.post('/spend', spendFunds);

export default router;
