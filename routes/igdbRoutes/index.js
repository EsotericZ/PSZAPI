import express from 'express';
const router = express.Router();

import {
  searchGames,
} from '../../controllers/igdbController.js';

router.route('/')
  .post(searchGames);

export default router;