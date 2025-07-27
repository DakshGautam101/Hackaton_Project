import { Pool } from '../models/pool.model.js';

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

    const pool = await Pool.findById(poolId);
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

    pool.joinedVendors.push({ vendorId, quantity });

    if (currentQty + quantity >= pool.totalRequiredQuantity) {
      pool.isClosed = true;
    }

    await pool.save();
    
    // Populate and return updated pool
    const updatedPool = await Pool.findById(poolId)
      .populate('productId')
      .populate('joinedVendors.vendorId', 'username email');
    
    res.status(200).json({ pool: updatedPool, message: "Successfully joined the pool" });
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