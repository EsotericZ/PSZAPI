import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
    getAllFeatured,
    getNewUsers,
    getVerifiedUsers,
} from '../../controllers/adminController.js';

router.route('/')
  .get(verifyRoles(ROLES.ADMIN), getAllFeatured);

router.route('/newUsers')
  .get(verifyRoles(ROLES.ADMIN), getNewUsers);

router.route('/verified')
  .get(verifyRoles(ROLES.ADMIN), getVerifiedUsers);

export default router;