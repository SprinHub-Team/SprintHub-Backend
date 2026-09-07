import { Router } from 'express';
import { columnController } from '../dependencies/columnDependency';
import { requireAuth } from '../middlewares/authMiddleware';


const router = Router();

router.use(requireAuth);

router.get('/board/:boardId', columnController.findByBoardId.bind(columnController));
router.get('/:id', columnController.getColumnWhitDetails.bind(columnController));
router.post('/', columnController.create.bind(columnController));
router.put('/:id', columnController.update.bind(columnController));
router.delete('/:id', columnController.delete.bind(columnController));

export default router;
