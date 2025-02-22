import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  getUserWishlist,
  updateWishlist,
} from '../../controllers/wishlistController.js';

router.route('/')
  .post(verifyRoles(ROLES.ADMIN, ROLES.BLOGGER, ROLES.PLAYER), updateWishlist);

router.route('/:id')
  .get(getUserWishlist);

export default router;