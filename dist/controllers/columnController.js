"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnController = void 0;
const idValidator_1 = require("../utils/idValidator");
class ColumnController {
    columnService;
    constructor(columnService) {
        this.columnService = columnService;
    }
    async findByBoardId(req, res, next) {
        try {
            const userId = req.user.userId;
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.boardId);
            const columns = await this.columnService.findByBoardId(boardId, userId);
            return res.status(200).json({
                data: columns
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getColumnWhitDetails(req, res, next) {
        try {
            const userId = req.user.userId;
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const column = await this.columnService.getColumnWhitDetails(columnId, userId);
            return res.status(200).json({
                data: column
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ColumnController = ColumnController;
