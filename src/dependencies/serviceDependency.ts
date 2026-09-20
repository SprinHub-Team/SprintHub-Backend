import { repositories as r } from './repositoryDependency';
import { UserService } from '../service/userService';
import { GroupService } from '../service/groupService';
import { BoardService } from '../service/boardService';
import { ColumnService } from '../service/columnService';
import { CardService } from '../service/cardService';
import { CommentService } from '../service/commentService';
import { AuthService } from '../service/authService';
import { CardPBService } from '../service/cardPBService';
import { ProjectDocumentService } from '../service/projectDocumentService';
import { SprintService } from '../service/sprintService';
import { ReportService } from '../service/reportService';
import SupabaseStorageService from '../service/storage/supabaseStorageService';
import CloudinaryStorageService from '../service/storage/cloudinaryStorageService';

const supabase = new SupabaseStorageService(); 
const cloudinary = new CloudinaryStorageService(); 

export const services = {
  supabase,
  cloudinary,
  user: new UserService(r.user),
  group: new GroupService(r.group, r.user),
  board: new BoardService(r.board, r.group, r.column, r.card, supabase),
  column: new ColumnService(r.column, r.board, r.card, r.group, supabase),
  card: new CardService(r.card, r.column, r.user, r.comment, r.group, supabase),
  comment: new CommentService(r.comment, r.card, r.user, r.group),
  auth: new AuthService(r.user),
  cardPb: new CardPBService(r.cardPb),
  projectDd: new ProjectDocumentService(r.projectDd, r.group),
  sprint: new SprintService(r.sprint, r.cardPb, r.card),
  report: new ReportService(r.report)
};