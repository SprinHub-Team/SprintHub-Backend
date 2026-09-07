import { BoardRepository } from '../repository/boardRepository';
import { BoardService } from '../service/boardService';
import { BoardController} from '../controllers/boardController';
import { userRepository } from '../dependencies/userDependency';
import { groupRepository } from '../dependencies/groupDependency';
import { columnRepository } from '../dependencies/columnDependency';

export const boardrepository = new BoardRepository();

export const boardService = new BoardService(
    boardrepository,
    userRepository,
    groupRepository,
    columnRepository);

export const boardController = new BoardController(boardService);