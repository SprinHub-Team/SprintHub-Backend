import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';

const commentController = controllers.comment;
const router = Router();

router.use(requireAuth);

router.get('/card/:card', commentController.findByCardId.bind(commentController));
router.get('/:id', commentController.getCommentWhitDetails.bind(commentController));

export default router;
