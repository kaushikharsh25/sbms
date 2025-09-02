import { Router } from 'express';
import authRoutes from './authRoutes.mjs';
import busRoutes from './busRoutes.mjs';
import routeRoutes from './routeRoutes.mjs';
import locationRoutes from './locationRoutes.mjs';
import etaRoutes from './etaRoutes.mjs';

const router = Router();

router.use('/auth', authRoutes);
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);
router.use('/locations', locationRoutes);
router.use('/eta', etaRoutes);

export default router;


