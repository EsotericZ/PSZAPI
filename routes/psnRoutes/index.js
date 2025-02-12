import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getPSNUserGames
} from '../../controllers/psnController.js';

router.route('/')
  .get(getPSNUserGames);
  // .get(verifyRoles(ROLES.ADMIN), getPSNUserGames);

export default router;