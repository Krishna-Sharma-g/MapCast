import { Router } from 'express';
import {
  listFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favoritesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);

export default router;
