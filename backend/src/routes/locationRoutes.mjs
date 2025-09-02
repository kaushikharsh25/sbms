import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.mjs';
import { pushLocation, getLatestLocation, getBusLocationHistory } from '../controllers/locationController.mjs';

const router = Router();

// Drivers push updates
router.post('/', authenticate, authorize(['driver']), pushLocation);

// Public/authorized consumers can fetch
router.get('/:busId/latest', authenticate, getLatestLocation);
router.get('/:busId/history', authenticate, getBusLocationHistory);

export default router;


