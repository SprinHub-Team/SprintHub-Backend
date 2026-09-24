"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const idValidator_1 = require("../utils/idValidator");
class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async findByCardId(req, res, next) {
        try {
            const userId = req.user.userId;
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const comments = await this.commentService.findByCardId(cardId, userId);
            return res.status(200).json(comments);
        }
        catch (error) {
            next(error);
        }
    }
    async getCommentWhitDetails(req, res, next) {
        try {
            const userId = req.user.userId;
            const commentId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const comment = await this.commentService.getCommentWhitDetails(commentId, userId);
            return res.status(200).json(comment);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
