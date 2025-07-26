import {Router} from 'express';
import { login, signup, handleProfile } from '../controllers/auth.controller.js';


const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', handleProfile);

export default router;