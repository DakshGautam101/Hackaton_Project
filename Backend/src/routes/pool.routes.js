import express from 'express';
import { createPool, joinPool, getAllPools } from '../controllers/pool.conroller.js';
import { protectRoute} from '../middlewares/verify.js';

const router = express.Router();

// Create a new pool (supplier)
router.post('/', protectRoute, createPool);

// Join a pool (vendor)
router.post('/:poolId/join', protectRoute, joinPool);

// Get all pools
router.get('/', protectRoute, getAllPools);

export default router;
