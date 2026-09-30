import { services as s } from './serviceDependency';
import { BoardController } from '../controllers/boardController';
import { CardPBController } from '../controllers/cardPBController';
import { ProjectDocumentController } from '../controllers/projectDocumentController';
import { SprintController } from '../controllers/SprintController';
import { UserController } from '../controllers/userController';
import { GroupController } from '../controllers/groupController';
import { ReportController } from '../controllers/reportController';
import { AuthController } from '../controllers/authController';

export const controllers = {
  board: new BoardController(s.board),
  auth: new AuthController(s.auth),
  cardPb: new CardPBController(s.cardPb),
  projectDd: new ProjectDocumentController(s.projectDd),
  sprint: new SprintController(s.sprint),
  user: new UserController(s.user),
  group: new GroupController(s.group),
  report: new ReportController(s.report)
};