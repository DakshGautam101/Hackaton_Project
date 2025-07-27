import {Router} from 'express';
import { login, signup, handleProfile, getUser } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/verify.js';
import { updateLocation } from '../controllers/auth.controller.js';
import { captureLocation } from '../middlewares/captureLocation.js';


const router = Router();

router.post('/signup', captureLocation, signup);
router.post('/login', login);
router.get('/profile', handleProfile);
router.get('/get-user',protectRoute, getUser);

router.patch('/update-location', protectRoute, updateLocation);


export default router;