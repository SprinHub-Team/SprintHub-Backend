import { Router } from 'express';
import { BoardRepository } from '../repository/boardRepository';
import { BoardService } from '../service/boardService';
import { BoardController} from '../controllers/boardController';
import { requireAuth } from '../middlewares/authMiddleware';
import { UserRepository } from '../repository/userRepository';
import { GroupRepository } from '../repository/groupRepository';
import { ColumnRepository } from '../repository/columnRepository';

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
