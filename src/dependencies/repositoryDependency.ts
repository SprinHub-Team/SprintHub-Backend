import { BoardRepository } from "../repository/boardRepository";
import { CardPBRepository } from "../repository/cardPBRepository";
import { CardRepository } from "../repository/cardRepository";
import { ColumnRepository } from "../repository/columnRepository";
import { CommentRepository } from "../repository/commentRepository";
import { GroupRepository } from "../repository/groupRepository";
import { ProjectDocumentRepository } from "../repository/projectDocumentRepository";
import { ReportRepository } from "../repository/reportRepository";
import { SprintRepository } from "../repository/sprintRepository";
import { UserRepository } from "../repository/userRepository";

export const repositories = {
    user: new UserRepository(),
    group: new GroupRepository(),
    board: new BoardRepository(),
    column: new ColumnRepository(),
    card: new CardRepository(),
    comment: new CommentRepository(),
    cardPb: new CardPBRepository(),
    projectDd: new ProjectDocumentRepository(),
    sprint: new SprintRepository(),
    report: new ReportRepository()
}