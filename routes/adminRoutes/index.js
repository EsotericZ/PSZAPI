import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
    getAllFeatured,
    getAllUsers,
} from '../../controllers/adminController.js';

router.route('/')
  .get(verifyRoles(ROLES.ADMIN), getAllFeatured);

router.route('/users')
  .get(verifyRoles(ROLES.ADMIN), getAllUsers);

export default router;