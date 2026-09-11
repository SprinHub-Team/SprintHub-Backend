import { services as s } from './serviceDependency';
import { BoardController } from '../controllers/boardController';
import { ColumnController } from '../controllers/columnController';
import { CardController } from '../controllers/cardController';
import { CommentController } from '../controllers/commentController';
import { AuthController } from '../controllers/authController';
import { CardPBController } from '../controllers/cardPBController';
import { ProjectDocumentController } from '../controllers/projectDocumentController';
import { SprintController } from '../controllers/SprintController';
import { UserController } from '../controllers/userController';
import { GroupController } from '../controllers/groupController';
import { ReportController } from '../controllers/reportController';

export const controllers = {
  board: new BoardController(s.board),
  column: new ColumnController(s.column),
  card: new CardController(s.card),
  comment: new CommentController(s.comment),
  auth: new AuthController(s.auth),
  cardPb: new CardPBController(s.cardPb),
  projectDd: new ProjectDocumentController(s.projectDd),
  sprint: new SprintController(s.sprint),
  user: new UserController(s.user),
  group: new GroupController(s.group),
  report: new ReportController(s.report)
};