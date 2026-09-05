"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const BoardDto_1 = require("../dtos/BoardDto");
const idValidator_1 = require("../utils/idValidator");
class BoardController {
    boardService;
    constructor(boardService) {
        this.boardService = boardService;
    }
    async findByGroupId(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const boards = await this.boardService.findByGroupId(groupId);
            return res.status(200).json({
                data: boards
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBoardWhitDetails(req, res, next) {
        try {
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const board = await this.boardService.getBoardWhitDetails(boardId);
            return res.status(200).json({
                data: board
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const ownerId = req.user?.userId || req.user?.id || req.body.ownerId;
            const data = BoardDto_1.createBoardSchema.parse({ ...req.body, ownerId });
            const board = await this.boardService.create(data);
            return res.status(201).json({
                message: "Tablero creado correctamente",
                data: board
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const data = BoardDto_1.updateBoardSchema.parse(req.body);
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const board = await this.boardService.update(boardId, data);
            return res.status(200).json({
                message: "Tablero actulizado correctamente",
                data: board
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            await this.boardService.delete(boardId);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BoardController = BoardController;
