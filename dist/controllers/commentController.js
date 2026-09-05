"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const CommentDto_1 = require("../dtos/CommentDto");
const idValidator_1 = require("../utils/idValidator");
class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async findByCardId(req, res, next) {
        try {
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.card || req.params.id);
            const comments = await this.commentService.findByCardId(cardId);
            return res.status(200).json({
                data: comments
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCommentWhitDetails(req, res, next) {
        try {
            const commentId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const comment = await this.commentService.getCommentWhitDetails(commentId);
            return res.status(200).json({
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const data = CommentDto_1.createCommentSchema.parse(req.body);
            const comment = await this.commentService.create(data);
            return res.status(201).json({
                message: "Comentario creado correctamente",
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const data = CommentDto_1.updateCommentSchema.parse(req.body);
            const commentId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const comment = await this.commentService.update(commentId, data);
            return res.status(200).json({
                message: "Tablero actulizado correctamente",
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const commentId = idValidator_1.mongoIdSchema.parse(req.params.id);
            await this.commentService.delete(commentId);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
