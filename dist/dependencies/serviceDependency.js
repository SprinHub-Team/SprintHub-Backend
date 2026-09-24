"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const repositoryDependency_1 = require("./repositoryDependency");
const userService_1 = require("../service/userService");
const groupService_1 = require("../service/groupService");
const boardService_1 = require("../service/boardService");
const columnService_1 = require("../service/columnService");
const cardService_1 = require("../service/cardService");
const commentService_1 = require("../service/commentService");
const authService_1 = require("../service/authService");
const cardPbService_1 = require("../service/cardPbService");
const projectDocumentService_1 = require("../service/projectDocumentService");
const sprintService_1 = require("../service/sprintService");
const reportService_1 = require("../service/reportService");
const supabaseStorageService_1 = __importDefault(require("../service/storage/supabaseStorageService"));
const cloudinaryStorageService_1 = __importDefault(require("../service/storage/cloudinaryStorageService"));
const supabase = new supabaseStorageService_1.default();
const cloudinary = new cloudinaryStorageService_1.default();
exports.services = {
    supabase,
    cloudinary,
    user: new userService_1.UserService(repositoryDependency_1.repositories.user),
    group: new groupService_1.GroupService(repositoryDependency_1.repositories.group, repositoryDependency_1.repositories.user, repositoryDependency_1.repositories.board, cloudinary),
    board: new boardService_1.BoardService(repositoryDependency_1.repositories.board, repositoryDependency_1.repositories.group, repositoryDependency_1.repositories.column, supabase),
    column: new columnService_1.ColumnService(repositoryDependency_1.repositories.column, repositoryDependency_1.repositories.board, repositoryDependency_1.repositories.card, repositoryDependency_1.repositories.group, supabase),
    card: new cardService_1.CardService(repositoryDependency_1.repositories.card, repositoryDependency_1.repositories.column, repositoryDependency_1.repositories.user, repositoryDependency_1.repositories.comment, repositoryDependency_1.repositories.group, supabase),
    comment: new commentService_1.CommentService(repositoryDependency_1.repositories.comment, repositoryDependency_1.repositories.card, repositoryDependency_1.repositories.user, repositoryDependency_1.repositories.group),
    auth: new authService_1.AuthService(repositoryDependency_1.repositories.user),
    cardPb: new cardPbService_1.CardPBService(repositoryDependency_1.repositories.cardPb),
    projectDd: new projectDocumentService_1.ProjectDocumentService(repositoryDependency_1.repositories.projectDd, repositoryDependency_1.repositories.group),
    sprint: new sprintService_1.SprintService(repositoryDependency_1.repositories.sprint, repositoryDependency_1.repositories.cardPb, repositoryDependency_1.repositories.card),
    report: new reportService_1.ReportService(repositoryDependency_1.repositories.report)
};
