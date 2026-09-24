"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositories = void 0;
const boardRepository_1 = require("../repository/boardRepository");
const cardPBRepository_1 = require("../repository/cardPBRepository");
const cardRepository_1 = require("../repository/cardRepository");
const columnRepository_1 = require("../repository/columnRepository");
const commentRepository_1 = require("../repository/commentRepository");
const groupRepository_1 = require("../repository/groupRepository");
const projectDocumentRepository_1 = require("../repository/projectDocumentRepository");
const reportRepository_1 = require("../repository/reportRepository");
const sprintRepository_1 = require("../repository/sprintRepository");
const userRepository_1 = require("../repository/userRepository");
exports.repositories = {
    user: new userRepository_1.UserRepository(),
    group: new groupRepository_1.GroupRepository(),
    board: new boardRepository_1.BoardRepository(),
    column: new columnRepository_1.ColumnRepository(),
    card: new cardRepository_1.CardRepository(),
    comment: new commentRepository_1.CommentRepository(),
    cardPb: new cardPBRepository_1.CardPBRepository(),
    projectDd: new projectDocumentRepository_1.ProjectDocumentRepository(),
    sprint: new sprintRepository_1.SprintRepository(),
    report: new reportRepository_1.ReportRepository()
};
