import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.mjs';
import { listBuses, getBus, createBus, updateBus, deleteBus } from '../controllers/busController.mjs';

const router = Router();

router.get('/', authenticate, listBuses);
router.get('/:id', authenticate, getBus);
router.post('/', authenticate, authorize(['admin']), createBus);
router.put('/:id', authenticate, authorize(['admin']), updateBus);
router.delete('/:id', authenticate, authorize(['admin']), deleteBus);

export default router;


