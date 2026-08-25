import { Router } from 'express';
import { createCard, getCards, updateCard, deleteCard } from '../controllers/cardController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', createCard);
router.get('/board/:boardId', getCards);
router.put('/:cardId', updateCard);
router.delete('/:cardId', deleteCard);

export default router;
