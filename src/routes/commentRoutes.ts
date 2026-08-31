import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { CommentRepository } from '../repository/commentRepository';
import { CommentService } from '../service/commentService';
import { UserRepository } from '../repository/userRepository';
import { CommentController } from '../controllers/commentController';
import { CardRepository } from '../repository/cardRepository';

const commentRepository = new CommentRepository();
const cardRepository = new CardRepository();
const userRepository = new UserRepository();

const commentService = new CommentService(
    commentRepository,
    cardRepository,
    userRepository
);

const commentController = new CommentController(commentService);

const router = Router();

router.use(requireAuth);

router.post('/', commentController.create);
router.get('/card/:card', commentController.findByCardId);
router.get('/:id', commentController.getCommentWhitDetails);
router.put('/:id', commentController.update);
router.delete('/:id', commentController.delete);

export default router;
