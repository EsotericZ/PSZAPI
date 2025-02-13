import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
} from '../../controllers/psnController.js';

router.route('/')
  .get(getPSNUserGames);
  // .get(verifyRoles(ROLES.ADMIN), getPSNUserGames);

router.route('/data')
  .get(getPSNUserData);

router.route('/friends')
  .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), getPSNUserFriends);

export default router;