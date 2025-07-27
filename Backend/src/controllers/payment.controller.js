import { razorpay } from '../lib/razorpay.js';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';

export const createUPIOrder = async (req, res) => {
  const { amount, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: receipt || `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

// Create wallet-specific order
export const createWalletOrder = async (req, res) => {
  const { amount } = req.body;
  // Try to get ID from user object - could be stored as id or _id
  // For debugging, allow wallet funding without user authentication during development
  const userId = req.user ? (req.user._id || req.user.id) : 'guest_' + Date.now();
  
  console.log('Creating wallet order:', { amount, userId });
  
  // Check if Razorpay credentials are available
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials missing');
    return res.status(500).json({ message: "Razorpay configuration error. Please check server logs." });
  }

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `wallet_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        purpose: 'wallet_funding'
      },
      payment_capture: 1,
    };

    console.log('Razorpay order options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);
    res.status(200).json(order);
  } catch (error) {
    console.error('Wallet order creation error:', error);
    // Send more detailed error information for debugging
    res.status(500).json({ 
      message: "Wallet order creation failed", 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      details: error.details || error.error || 'No additional details'
    });
  }
};

// Verify wallet payment and add funds
export const verifyWalletPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
  // Try to get ID from user object - could be stored as id or _id
  const userId = req.user._id || req.user.id;
  
  console.log('Verifying wallet payment:', { razorpay_order_id, razorpay_payment_id, userId, amount });

  try {
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Add funds to wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update wallet balance
    user.wallet = (user.wallet || 0) + parseFloat(amount);
    await user.save();

    // Record transaction
    const txn = await Transaction.create({
      userId,
      type: 'credit',
      amount: parseFloat(amount),
      reason: 'Funds added to wallet via Razorpay',
      paymentDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      }
    });

    res.status(200).json({ 
      success: true, 
      message: "Payment verified and wallet updated successfully",
      balance: user.wallet,
      transaction: txn
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};
