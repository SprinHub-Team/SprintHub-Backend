"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
const columnRoutes_1 = __importDefault(require("./routes/columnRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const cardPBRoutes_1 = __importDefault(require("./routes/cardPBRoutes"));
const sprintRoutes_1 = __importDefault(require("./routes/sprintRoutes"));
const projectDocumentRoutes_1 = __importDefault(require("./routes/projectDocumentRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/groups", groupRoutes_1.default);
app.use("/api/boards", boardRoutes_1.default);
app.use("/api/columns", columnRoutes_1.default);
app.use("/api/cards", cardRoutes_1.default);
app.use("/api/comment", commentRoutes_1.default);
app.use("/api/reports", reportRoutes_1.default);
app.use("/api/cardPB", cardPBRoutes_1.default);
app.use("/api/sprints", sprintRoutes_1.default);
app.use("/api/project-documents", projectDocumentRoutes_1.default);
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Api funcionando.",
    });
});
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
