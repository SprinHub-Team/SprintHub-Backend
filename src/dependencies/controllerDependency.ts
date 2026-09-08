import { services as s } from './serviceDependency';
import { BoardController } from '../controllers/boardController';
import { ColumnController } from '../controllers/columnController';
import { CardController } from '../controllers/cardController';
import { CommentController } from '../controllers/commentController';

export const controllers = {
  board: new BoardController(s.board),
  column: new ColumnController(s.column),
  card: new CardController(s.card),
  comment: new CommentController(s.comment),
};