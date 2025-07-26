import { Pool } from '../models/pool.model.js';

export const createPool = async (req, res) => {
  try {
    const { productId, totalRequiredQuantity } = req.body;

    const pool = await Pool.create({
      productId,
      totalRequiredQuantity,
    });

    res.status(201).json(pool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const { vendorId, quantity } = req.body;

    const pool = await Pool.findById(poolId);
    if (!pool) return res.status(404).json({ message: "Pool not found" });

    const currentQty = pool.joinedVendors.reduce((sum, v) => sum + v.quantity, 0);
    const remainingQty = pool.totalRequiredQuantity - currentQty;

    if (quantity > remainingQty)
      return res.status(400).json({ message: "Quantity exceeds pool requirement" });

    pool.joinedVendors.push({ vendorId, quantity });

    if (currentQty + quantity >= pool.totalRequiredQuantity) {
      pool.isClosed = true;
    }

    await pool.save();
    res.status(200).json(pool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPools = async (req, res) => {
  try {
    const pools = await Pool.find()
      .populate('productId')
      .populate('joinedVendors.vendorId', 'name');
    res.status(200).json(pools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
