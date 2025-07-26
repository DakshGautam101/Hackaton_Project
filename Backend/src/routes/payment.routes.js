import express from 'express';
import { createUPIOrder, verifyPayment } from '../controllers/payment.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

router.post('/create', protectRoute, createUPIOrder); // UPI order creation
router.post('/verify', protectRoute, verifyPayment); // Payment verification

export default router;
