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

router.post('/', cardController.create.bind(cardController));
router.get('/column/:column', cardController.findByColumnId.bind(cardController));
router.get('/board/:boardId', cardController.findByBoardId.bind(cardController));
router.get('/:id', cardController.getCardWhitDetails.bind(cardController));
router.put('/:id', cardController.update.bind(cardController));
router.delete('/:id', cardController.delete.bind(cardController));

export default router;
