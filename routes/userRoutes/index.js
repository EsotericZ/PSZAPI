import express from 'express';
const router = express.Router();

import {
    getAllUsers,
} from '../../controllers/userController.js';

router.route('/')
  .get(getAllUsers);

export default router;