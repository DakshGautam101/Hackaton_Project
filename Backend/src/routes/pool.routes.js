import express from 'express';
import { createPool, joinPool, getAllPools, getPoolById } from '../controllers/pool.conroller.js';
import { protectRoute, requireVendor } from '../middlewares/verify.js';

const router = express.Router();

// Create a new pool - restricted to vendors only
router.post('/', protectRoute, requireVendor, createPool);

// Join a pool - restricted to vendors only
router.post('/:poolId/join', protectRoute, requireVendor, joinPool);

// Get all pools (public endpoint)
router.get('/', getAllPools);

// Get pool by ID (public endpoint)
router.get('/:id', getPoolById);

export default router;
