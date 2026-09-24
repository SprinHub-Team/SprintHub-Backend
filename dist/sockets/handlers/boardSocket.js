"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBoardHandlers = registerBoardHandlers;
const serviceDependency_1 = require("../../dependencies/serviceDependency");
const idValidator_1 = require("../../utils/idValidator");
const boardService = serviceDependency_1.services.board;
function registerBoardHandlers(io, socket) {
    socket.on('board:join', async (boardId, callback) => {
        try {
            const boardIdParsed = idValidator_1.mongoIdSchema.parse(boardId);
            const board = await boardService.getBoardWhitDetails(boardIdParsed, socket.data.userId);
            socket.join(`board:${boardIdParsed}`);
            callback?.({ ok: true, board });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('board:leave', (boardIdParsed) => {
        socket.leave(`board:${boardIdParsed}`);
    });
}
