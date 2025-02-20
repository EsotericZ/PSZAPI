import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getAllUserFriends
} from '../../controllers/friendController.js';

router.route('/:id')
  .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), getAllUserFriends);

export default router;