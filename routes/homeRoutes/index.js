import express from 'express';
const router = express.Router();

import {
    getAllFeatured,
} from '../../controllers/homeController.js';

router.route('/')
  .get(getAllFeatured);

export default router;