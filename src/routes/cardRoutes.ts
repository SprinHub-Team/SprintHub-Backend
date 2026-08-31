import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { CardRepository } from '../repository/cardRepository';
import { CardService } from '../service/cardService';
import { ColumnRepository } from '../repository/columnRepository';
import { UserRepository } from '../repository/userRepository';
import { CommentRepository } from '../repository/commentRepository';
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
router.get('/:id', cardController.getCardWhitDetails);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.delete);

export default router;
