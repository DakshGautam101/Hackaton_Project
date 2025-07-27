import express from 'express';
import { getDistance } from '../controllers/distance.controller.js';
import { User } from '../models/user.model.js';
import { getNearbyUsers } from '../controllers/vendor.controller.js';

const router = express.Router();
router.post('/', getDistance);
router.get('/nearby', getNearbyUsers);

export default router;