import express from 'express';
const router = express.Router();

import {
  createUser,
  loginUser,
} from '../../controllers/portalController.js';

router.route('/')
  .post(createUser)
  .put(loginUser);

export default router;