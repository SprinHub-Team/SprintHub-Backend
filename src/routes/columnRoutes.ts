import { Router } from 'express';
import {ColumnRepository} from '../repository/columnRepository';
import {ColumnService} from '../service/columnService';
import { ColumnController } from '../controllers/columnController';
import { requireAuth } from '../middlewares/authMiddleware';
import { BoardRepository } from '../repository/boardRepository';
import { CardRepository } from '../repository/cardRepository';

const columnRepository = new ColumnRepository();
const boardRepository = new BoardRepository();
const cardRepository = new CardRepository();

const columnService = new ColumnService(
    columnRepository,
    boardRepository,
    cardRepository );

const columnController = new ColumnController(columnService);

const router = Router();

router.use(requireAuth);

router.get('/board/:boardId', columnController.findByBoardId);
router.get('/:id', columnController.getColumnWhitDetails);
router.post('/', columnController.create);
router.put('/:id', columnController.update);
router.delete('/:id', columnController.delete);

export default router;
