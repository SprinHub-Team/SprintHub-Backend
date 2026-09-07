import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { cardController } from '../dependencies/cardDependency';

const router = Router();

router.use(requireAuth);

router.post('/', cardController.create.bind(cardController));
router.get('/column/:column', cardController.findByColumnId.bind(cardController));
router.get('/board/:boardId', cardController.findByBoardId.bind(cardController));
router.get('/:id', cardController.getCardWhitDetails.bind(cardController));
router.put('/:id', cardController.update.bind(cardController));
router.delete('/:id', cardController.delete.bind(cardController));

export default router;
