import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { commentController } from '../dependencies/commentDependency';


const router = Router();

router.use(requireAuth);

router.post('/', commentController.create.bind(commentController));
router.get('/card/:card', commentController.findByCardId.bind(commentController));
router.get('/:id', commentController.getCommentWhitDetails.bind(commentController));
router.put('/:id', commentController.update.bind(commentController));
router.delete('/:id', commentController.delete.bind(commentController));

export default router;
