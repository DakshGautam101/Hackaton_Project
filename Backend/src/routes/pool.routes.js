import express from 'express';
import { createPool, joinPool, getAllPools, getPoolById, endPool } from '../controllers/pool.conroller.js';
import { protectRoute, requireVendor } from '../middlewares/verify.js';

const router = express.Router();

// Create a new pool - restricted to vendors only
router.post('/', protectRoute, requireVendor, createPool);

// Join a pool - restricted to vendors only
router.post('/:poolId/join', protectRoute, requireVendor, joinPool);

// End a pool - restricted to pool creator only
router.patch('/:poolId/end', protectRoute, requireVendor, endPool);

// Get all pools (public endpoint)
router.get('/', getAllPools);

// Get pool by ID (public endpoint)
router.get('/:id', getPoolById);

export default router;
