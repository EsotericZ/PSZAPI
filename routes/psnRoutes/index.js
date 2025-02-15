import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  updateUserPSN
} from '../../controllers/psnController.js';

router.route('/:id')
  .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), updateUserPSN);

export default router;