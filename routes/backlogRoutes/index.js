import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  updateBacklog
} from '../../controllers/backlogController.js';

router.route('/')
  .post(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), updateBacklog);

export default router;