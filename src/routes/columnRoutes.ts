import { Router } from 'express';
import {ColumnRepository} from '../repository/ColumnRepository';
import {ColumnService} from '../service/ColumnService';
import { ColumnController } from '../controllers/columnController';
import { requireAuth } from '../middlewares/authMiddleware';
import { BoardRepository } from '../repository/BoardRepository';
import { CardRepository } from '../repository/CardRepository';

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

router.get('/board/:boardId', columnController.findByBoardId.bind(columnController));
router.get('/:id', columnController.getColumnWhitDetails.bind(columnController));
router.post('/', columnController.create.bind(columnController));
router.put('/:id', columnController.update.bind(columnController));
router.delete('/:id', columnController.delete.bind(columnController));

export default router;
