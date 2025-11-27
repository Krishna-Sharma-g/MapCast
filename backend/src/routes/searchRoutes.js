import { Router } from 'express';
import {
  searchLocations,
  reverseLookup,
} from '../controllers/searchController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, searchLocations);
router.get('/reverse', authMiddleware, reverseLookup);

export default router;
