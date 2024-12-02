import express from 'express';
const router = express.Router();

import portalRoutes from './portalRoutes/index.js';
import userRoutes from './userRoutes/index.js';

router.use('/portal', portalRoutes);
router.use('/users', userRoutes);

export default router;