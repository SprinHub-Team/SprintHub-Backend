import { Router } from 'express';
import { getBoardsByGroup, createBoard, updateBoard, deleteBoard } from '../controllers/boardController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/group/:groupId', getBoardsByGroup);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
