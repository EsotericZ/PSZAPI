import express from 'express';
const router = express.Router();

import {
  getAllGames,
  searchGames,
} from '../../controllers/igdbController.js';

router.route('/')
  .get(getAllGames)
  .post(searchGames);

export default router;