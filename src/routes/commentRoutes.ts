import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { CommentRepository } from '../repository/CommentRepository';
import { CommentService } from '../service/CommentService';
import { UserRepository } from '../repository/UserRepository';
import { CommentController } from '../controllers/commentController';
import { CardRepository } from '../repository/CardRepository';

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

router.post('/', commentController.create.bind(commentController));
router.get('/card/:card', commentController.findByCardId.bind(commentController));
router.get('/:id', commentController.getCommentWhitDetails.bind(commentController));
router.put('/:id', commentController.update.bind(commentController));
router.delete('/:id', commentController.delete.bind(commentController));

export default router;
