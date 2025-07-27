import { Pool } from '../models/pool.model.js';
import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';
import { Product } from '../models/product.model.js';

export const createPool = async (req, res) => {
  try {
    const { productId, totalRequiredQuantity } = req.body;
    
    // Get vendorId from authenticated user
    const vendorId = req.user._id;

    const pool = await Pool.create({
      productId,
      totalRequiredQuantity,
      createdBy: vendorId, // Track who created the pool
    });

    res.status(201).json(pool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const { quantity } = req.body;
    const vendorId = req.user.id; // Get user ID from auth middleware

    const pool = await Pool.findById(poolId).populate('productId');
    if (!pool) return res.status(404).json({ message: "Pool not found" });

    // Check if user already joined this pool
    const alreadyJoined = pool.joinedVendors.find(vendor => vendor.vendorId.toString() === vendorId);
    if (alreadyJoined) {
      return res.status(400).json({ message: "You have already joined this pool" });
    }

    const currentQty = pool.joinedVendors.reduce((sum, v) => sum + v.quantity, 0);
    const remainingQty = pool.totalRequiredQuantity - currentQty;

    if (quantity > remainingQty) {
      return res.status(400).json({ message: "Quantity exceeds pool requirement" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Get product details to calculate cost
    if (!pool.productId) {
      return res.status(400).json({ message: "Pool product not found" });
    }

    // Calculate total cost for joining the pool
    const pricePerKg = pool.productId.pricePerKg || 0;
    const totalCost = pricePerKg * quantity;

    // Find user and check wallet balance
    const user = await User.findById(vendorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if wallet has enough funds
    if ((user.wallet || 0) < totalCost) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        required: totalCost,
        available: user.wallet || 0
      });
    }

    // Deduct funds from wallet
    user.wallet = (user.wallet || 0) - totalCost;
    await user.save();

    // Record transaction
    const transaction = await Transaction.create({
      userId: vendorId,
      type: 'debit',
      amount: totalCost,
      reason: `Joined Pool: ${pool.productId.name} (${quantity}kg)`,
      paymentDetails: {
        poolId: pool._id,
        productId: pool.productId._id,
        quantity,
        pricePerKg
      }
    });

    // Add user to pool
    pool.joinedVendors.push({ vendorId, quantity });

    if (currentQty + quantity >= pool.totalRequiredQuantity) {
      pool.isClosed = true;
    }

    await pool.save();
    
    // Populate and return updated pool
    const updatedPool = await Pool.findById(poolId)
      .populate('productId')
      .populate('joinedVendors.vendorId', 'username email');
    
    res.status(200).json({ 
      pool: updatedPool, 
      message: `Successfully joined the pool! ₹${totalCost} deducted from wallet.`,
      transaction: {
        id: transaction._id,
        amount: totalCost,
        balance: user.wallet
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await Pool.findById(id)
      .populate('productId')
      .populate('joinedVendors.vendorId', 'username email');
    
    if (!pool) {
      return res.status(404).json({ message: "Pool not found" });
    }
    
    res.status(200).json({ pool });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPools = async (req, res) => {
  try {
    const pools = await Pool.find()
      .populate('productId')
      .populate('joinedVendors.vendorId', 'username email');
    res.status(200).json({ pools });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const endPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const userId = req.user.id;

    const pool = await Pool.findById(poolId).populate('productId');
    if (!pool) {
      return res.status(404).json({ message: "Pool not found" });
    }

    // Check if the user is the creator of the pool
    if (pool.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the pool creator can end this pool" });
    }

    // Check if pool is already closed
    if (pool.isClosed) {
      return res.status(400).json({ message: "Pool is already closed" });
    }

    // Close the pool
    pool.isClosed = true;
    pool.closedAt = new Date();
    await pool.save();

    // Populate and return updated pool
    const updatedPool = await Pool.findById(poolId)
      .populate('productId')
      .populate('joinedVendors.vendorId', 'username email');

    res.status(200).json({ 
      pool: updatedPool, 
      message: "Pool has been successfully ended" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};