import express from 'express';
const router = express.Router();

import adminRoutes from './adminRoutes/index.js';
import gameRoutes from './gamesRoutes/index.js';
import portalRoutes from './portalRoutes/index.js';

router.use('/admin', adminRoutes);
router.use('/games', gameRoutes);
router.use('/portal', portalRoutes);

export default router;