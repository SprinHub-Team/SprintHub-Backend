"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommentHandlers = registerCommentHandlers;
const serviceDependency_1 = require("../../dependencies/serviceDependency");
const commentInputDto_1 = require("../../dtos/input/commentInputDto");
const commentService = serviceDependency_1.services.comment;
function registerCommentHandlers(io, socket) {
    socket.on('comment:create', async (data, callback) => {
        try {
            const commentData = commentInputDto_1.createCommentInputSchema.parse(data);
            const { comment, boardId } = await commentService.create(commentData, socket.data.userId);
            io.to(`board:${boardId}`).emit('comment:created', comment);
            callback?.({ ok: true, comment });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('comment:update', async (data, callback) => {
        try {
            const commentData = commentInputDto_1.updateCommentInputSchema.parse(data);
            const { comment, boardId } = await commentService.update(commentData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('comment:updated', comment);
            callback?.({ ok: true, comment });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('comment:delete', async (data, callback) => {
        try {
            const commentId = commentInputDto_1.deleteCommentInputSchema.parse(data);
            const boardId = await commentService.delete(commentId, socket.data.userId);
            io.to(`board:${boardId}`).emit('comment:deleted', commentId);
            callback?.({ ok: true });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
}
