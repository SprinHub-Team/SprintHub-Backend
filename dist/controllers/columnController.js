"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnController = void 0;
const ColumnDto_1 = require("../dtos/ColumnDto");
const idValidator_1 = require("../utils/idValidator");
class ColumnController {
    columnService;
    constructor(columnService) {
        this.columnService = columnService;
    }
    async findByBoardId(req, res, next) {
        try {
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.boardId || req.params.id);
            const columns = await this.columnService.findByBoardId(boardId);
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
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const column = await this.columnService.getColumnWhitDetails(columnId);
            return res.status(200).json({
                data: column
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const data = ColumnDto_1.createColumnSchema.parse(req.body);
            const column = await this.columnService.create(data);
            return res.status(201).json({
                message: "Columna creada correctamente",
                data: column
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const data = ColumnDto_1.updateColumnSchema.parse(req.body);
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const column = await this.columnService.update(columnId, data);
            return res.status(200).json({
                message: "Columna actulizada correctamente",
                data: column
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.id);
            await this.columnService.delete(columnId);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ColumnController = ColumnController;
