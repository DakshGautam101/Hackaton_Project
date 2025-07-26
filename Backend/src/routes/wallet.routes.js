import express from 'express';
import { getWallet, addFunds, spendFunds } from '../controllers/wallet.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

router.get('/:userId', protectRoute, getWallet);           
router.post('/add', protectRoute, addFunds);               
router.post('/spend', protectRoute, spendFunds);

export default router;
