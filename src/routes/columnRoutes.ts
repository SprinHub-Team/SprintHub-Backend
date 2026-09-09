import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';

const columnController = controllers.column;
const router = Router();

router.use(requireAuth);

router.get('/board/:boardId', columnController.findByBoardId.bind(columnController));
router.get('/:id', columnController.getColumnWhitDetails.bind(columnController));

export default router;
