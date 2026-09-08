"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrerBoardHandlers = registrerBoardHandlers;
const boardDependency_1 = require("../../dependencies/boardDependency");
const groupDependency_1 = require("../../dependencies/groupDependency");
function registrerBoardHandlers(io, socket) {
    socket.on('board:join', async (boardId, callback) => {
        try {
            const board = await boardDependency_1.boardService.getBoardWhitDetails(boardId);
            const isMember = await groupDependency_1.groupService.isMember(board.groupId.toString(), socket.data.role);
            if (!isMember) {
                return callback?.({ ok: false, error: 'No tienes acceso a este tablero' });
            }
            socket.join(`board:${boardId}`);
            callback?.({ ok: true, board });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('board:leave', (boardId) => {
        socket.leave(`board:${boardId}`);
    });
}
