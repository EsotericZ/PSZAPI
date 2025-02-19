import express from 'express';
const router = express.Router();

import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES from '../../config/roles.js';

import {
  getAllGames
} from '../../controllers/gameController.js';

router.route('/')
  // .get(verifyRoles(ROLES.ADMIN), getAllGames);
  .get(getAllGames);

export default router;