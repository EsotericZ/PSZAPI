import express from 'express';
const router = express.Router();

import {
    test,
} from '../../controllers/test.js';

router.route('/')
  .get(test);

export default router;