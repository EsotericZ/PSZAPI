import express from 'express';
const router = express.Router();

import adminRoutes from './adminRoutes/index.js';
import gameRoutes from './gameRoutes/index.js';
import homeRoutes from './homeRoutes/index.js';
import portalRoutes from './portalRoutes/index.js';
import psnRoutes from './psnRoutes/index.js';
import testRoutes from './testRoutes/index.js';

router.use('/admin', adminRoutes);
router.use('/games', gameRoutes);
router.use('/home', homeRoutes);
router.use('/portal', portalRoutes);
router.use('/psn', psnRoutes);
router.use('/test', testRoutes);

export default router;