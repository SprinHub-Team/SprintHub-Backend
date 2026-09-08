import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';

const cardController = controllers.card;
const router = Router();

router.use(requireAuth);

router.get('/column/:column', cardController.findByColumnId.bind(cardController));
router.get('/board/:boardId', cardController.findByBoardId.bind(cardController));
router.get('/:id', cardController.getCardWhitDetails.bind(cardController));

export default router;
