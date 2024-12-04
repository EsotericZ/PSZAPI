import express from 'express';
const router = express.Router();

import {
  loginUser,
  refreshToken,
} from '../../controllers/portalController.js';

router.route('/')
  .post(loginUser);

router.route('/refreshToken')
  .post(refreshToken);

export default router;