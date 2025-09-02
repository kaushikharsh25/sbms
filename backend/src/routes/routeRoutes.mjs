import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.mjs';
import { listRoutes, getRoute, createRoute, updateRoute, deleteRoute } from '../controllers/routeController.mjs';

const router = Router();

router.get('/', authenticate, listRoutes);
router.get('/:id', authenticate, getRoute);
router.post('/', authenticate, authorize(['admin']), createRoute);
router.put('/:id', authenticate, authorize(['admin']), updateRoute);
router.delete('/:id', authenticate, authorize(['admin']), deleteRoute);

export default router;


