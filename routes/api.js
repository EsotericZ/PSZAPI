import express from 'express';
const router = express.Router();

import adminRoutes from './adminRoutes/index.js';
import collectionRoutes from './collectionRoutes/index.js';
import gameRoutes from './gameRoutes/index.js';
import friendRoutes from './friendRoutes/index.js';
import homeRoutes from './homeRoutes/index.js';
import igdbRoutes from './igdbRoutes/index.js';
import portalRoutes from './portalRoutes/index.js';
import psnRoutes from './psnRoutes/index.js';

router.use('/admin', adminRoutes);
router.use('/collection', collectionRoutes);
router.use('/friends', friendRoutes);
router.use('/games', gameRoutes);
router.use('/home', homeRoutes);
router.use('/igdb', igdbRoutes);
router.use('/portal', portalRoutes);
router.use('/psn', psnRoutes);

export default router;