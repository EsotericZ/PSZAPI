import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getPSNUserData,
  getPSNUserFriends,
  getPSNUserGames,
} from '../../controllers/psnController.js';

router.route('/:id')
  // .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), updateUserPSN);
  .get(getPSNUserGames);

router.route('/data/:id')
  .get(getPSNUserData);

router.route('/friends/:id')
  // .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), getPSNUserFriends);
  .get(getPSNUserFriends);

export default router;