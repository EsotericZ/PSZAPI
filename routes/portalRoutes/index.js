import express from 'express';
const router = express.Router();

import {
  loginUser,
} from '../../controllers/portalController.js';

router.route('/')
  .post(loginUser);

export default router;