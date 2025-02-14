import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getAllUserCollection
} from '../../controllers/collectionController.js';

router.route('/:id')
  // .get(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), getAllUserFriends);
  .get(getAllUserCollection);

export default router;