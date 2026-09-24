"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerColumnsHandlers = registerColumnsHandlers;
const serviceDependency_1 = require("../../dependencies/serviceDependency");
const columnInputDto_1 = require("../../dtos/input/columnInputDto");
const columnService = serviceDependency_1.services.column;
function registerColumnsHandlers(io, socket) {
    socket.on('column:create', async (data, callback) => {
        try {
            const columnData = columnInputDto_1.createColumnInputSchema.parse(data);
            const column = await columnService.create(columnData, socket.data.userId);
            io.to(`board:${column.boardId}`).emit('column:created', column);
            callback?.({ ok: true, column });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('column:update', async (data, callback) => {
        try {
            const columnData = columnInputDto_1.updateColumnInputSchema.parse(data);
            const column = await columnService.update(columnData, socket.data.userId);
            socket.to(`board:${column.boardId}`).emit('column:updated', column);
            callback?.({ ok: true, column });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('column:delete', async (data, callback) => {
        try {
            const columnId = columnInputDto_1.deleteColumnInputSchema.parse(data);
            const boardId = await columnService.delete(columnId, socket.data.userId);
            io.to(`board:${boardId}`).emit('column:deleted', { columnId: columnId });
            callback?.({ ok: true });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
}
