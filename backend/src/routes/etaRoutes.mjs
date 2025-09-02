import { Router } from 'express';
import { authenticate } from '../middleware/auth.mjs';
import { etaToStop } from '../controllers/etaController.mjs';

const router = Router();

router.get('/:busId/:stopSeq', authenticate, etaToStop);

export default router;


