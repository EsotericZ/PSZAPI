import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js'

import {
  loginUser,
  refreshToken,
} from '../../controllers/portalController.js';

router.route('/')
  .post(loginUser);

router.route('/refreshToken')
  .post(verifyRoles(...Object.values(ROLES)), refreshToken);

export default router;