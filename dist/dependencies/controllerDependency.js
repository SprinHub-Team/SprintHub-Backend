"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = void 0;
const serviceDependency_1 = require("./serviceDependency");
const boardController_1 = require("../controllers/boardController");
const columnController_1 = require("../controllers/columnController");
const cardController_1 = require("../controllers/cardController");
const commentController_1 = require("../controllers/commentController");
const cardPBController_1 = require("../controllers/cardPBController");
const projectDocumentController_1 = require("../controllers/projectDocumentController");
const SprintController_1 = require("../controllers/SprintController");
const userController_1 = require("../controllers/userController");
const groupController_1 = require("../controllers/groupController");
const reportController_1 = require("../controllers/reportController");
const authController_1 = require("../controllers/authController");
exports.controllers = {
    board: new boardController_1.BoardController(serviceDependency_1.services.board),
    column: new columnController_1.ColumnController(serviceDependency_1.services.column),
    card: new cardController_1.CardController(serviceDependency_1.services.card),
    comment: new commentController_1.CommentController(serviceDependency_1.services.comment),
    auth: new authController_1.AuthController(serviceDependency_1.services.auth),
    cardPb: new cardPBController_1.CardPBController(serviceDependency_1.services.cardPb),
    projectDd: new projectDocumentController_1.ProjectDocumentController(serviceDependency_1.services.projectDd, serviceDependency_1.services.supabase),
    sprint: new SprintController_1.SprintController(serviceDependency_1.services.sprint),
    user: new userController_1.UserController(serviceDependency_1.services.user, serviceDependency_1.services.cloudinary),
    group: new groupController_1.GroupController(serviceDependency_1.services.group, serviceDependency_1.services.cloudinary),
    report: new reportController_1.ReportController(serviceDependency_1.services.report)
};
