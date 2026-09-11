import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';


const router = Router();

router.use(requireAuth);

router.get('/column/:column', cardController.findByColumnId.bind(cardController));
router.get('/board/:boardId', cardController.findByBoardId.bind(cardController));
router.get('/:id', cardController.getCardWhitDetails.bind(cardController));
router.post('/:id/attachments', uploadMiddleware.single('file'), cardController.uploadAttachment.bind(cardController));
router.delete('/:id/attachments/:attachmentId', cardController.removeAttachment.bind(cardController));

export default router;
