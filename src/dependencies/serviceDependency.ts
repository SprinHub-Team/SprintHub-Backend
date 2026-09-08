import { repositories as r } from './repositoryDependency';
import { UserService } from '../service/userService';
import { GroupService } from '../service/groupService';
import { BoardService } from '../service/boardService';
import { ColumnService } from '../service/columnService';
import { CardService } from '../service/cardService';
import { CommentService } from '../service/commentService';

export const services = {
  user: new UserService(r.user),
  group: new GroupService(r.group, r.user),
  board: new BoardService(r.board, r.user, r.group, r.column),
  column: new ColumnService(r.column, r.board, r.card),
  card: new CardService(r.card, r.column, r.user, r.comment),
  comment: new CommentService(r.comment, r.card, r.user),
};