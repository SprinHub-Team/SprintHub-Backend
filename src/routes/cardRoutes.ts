import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { CardRepository } from '../repository/CardRepository';
import { CardService } from '../service/CardService';
import { ColumnRepository } from '../repository/ColumnRepository';
import { UserRepository } from '../repository/UserRepository';
import { CommentRepository } from '../repository/CommentRepository';
import { CardController } from '../controllers/cardController';

const cardRepository = new CardRepository();
const columnRepository = new ColumnRepository();
const userRepository = new UserRepository();
const commentRepository = new CommentRepository();

const cardService = new CardService(
    cardRepository,
    columnRepository,
    userRepository,
    commentRepository
);

const cardController = new CardController(cardService);

const router = Router();

router.use(requireAuth);

router.post('/', cardController.create);
router.get('/column/:column', cardController.findByColumnId);
router.get('/board/:boardId', cardController.findByBoardId);
router.get('/:id', cardController.getCardWhitDetails);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.delete);

export default router;
