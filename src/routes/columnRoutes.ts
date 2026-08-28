import { Router } from 'express';
import { getColumnsByBoard, createColumn, updateColumn, deleteColumn } from '../controllers/columnController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/board/:boardId', getColumnsByBoard);
router.post('/', createColumn);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);

export default router;
