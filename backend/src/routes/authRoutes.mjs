import { Router } from 'express';
import { login, signup, me } from '../controllers/authController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;


