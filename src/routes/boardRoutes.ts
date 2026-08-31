import { Router } from 'express';
import { BoardRepository } from '../repository/BoardRepository';
import { BoardService } from '../service/BoardService';
import { BoardController} from '../controllers/boardController';
import { requireAuth } from '../middlewares/authMiddleware';
import { UserRepository } from '../repository/UserRepository';
import { GroupRepository } from '../repository/GroupRepository';
import { ColumnRepository } from '../repository/ColumnRepository';

const boardrepository = new BoardRepository();
const userRepository = new UserRepository();
const groupRepository = new GroupRepository();
const columnRepository = new ColumnRepository();

const boardService = new BoardService(
    boardrepository,
    userRepository,
    groupRepository,
    columnRepository);

const boardController = new BoardController(boardService);

const router = Router();

router.use(requireAuth);

router.get('/group/:groupId', boardController.findByGroupId );
router.get('/:id', boardController.getBoardWhitDetails );
router.post('/', boardController.create);
router.put('/:id', boardController.update);
router.delete('/:id', boardController.delete);

export default router;
