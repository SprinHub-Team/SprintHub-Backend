"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const idValidator_1 = require("../utils/idValidator");
const boardInputDto_1 = require("../dtos/input/boardInputDto");
class BoardController {
    boardService;
    constructor(boardService) {
        this.boardService = boardService;
    }
    async findByGroupId(req, res, next) {
        try {
            const userId = req.user.userId;
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const boards = await this.boardService.findByGroupId(groupId, userId);
            return res.status(200).json({ data: boards });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = boardInputDto_1.createBoardInputSchema.parse({ ...req.body });
            const board = await this.boardService.create(data, userId);
            return res.status(201).json({
                message: 'Tablero creado correctamente',
                data: board,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = boardInputDto_1.updateBoardInputSchema.parse(req.body);
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const board = await this.boardService.update(boardId, data, userId);
            return res.status(200).json({
                message: 'Tablero actulizado correctamente',
                data: board,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const userId = req.user.userId;
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            await this.boardService.delete(boardId, userId);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async applyTemplate(req, res, next) {
        try {
            const userId = req.user.userId;
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const templateId = req.body.templateId;
            await this.boardService.applyTemplate(boardId, templateId, userId);
            return res.status(200).json({
                message: 'Plantilla aplicada correctamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BoardController = BoardController;
