import { Router } from 'express';
import { getNearbyNews } from '../controllers/newsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getNearbyNews);

export default router;