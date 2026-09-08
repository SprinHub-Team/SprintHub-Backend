import { BoardRepository } from '../repository/boardRepository';
import { BoardService } from '../service/boardService';
import { BoardController} from '../controllers/boardController';
import { UserRepository } from '../repository/userRepository';
import { GroupRepository } from '../repository/groupRepository';
import { ColumnRepository } from '../repository/columnRepository';

export const boardrepository = new BoardRepository();

export const boardService = new BoardService(
    boardrepository,
    new UserRepository(),
    new GroupRepository(),
    new ColumnRepository()
);

export const boardController = new BoardController(boardService);