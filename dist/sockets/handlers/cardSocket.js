"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCardHandlers = registerCardHandlers;
const serviceDependency_1 = require("../../dependencies/serviceDependency");
const cardInputDto_1 = require("../../dtos/input/cardInputDto");
const cardService = serviceDependency_1.services.card;
function registerCardHandlers(io, socket) {
    socket.on('card:create', async (data, callback) => {
        try {
            const cardData = cardInputDto_1.createCardInputSchema.parse(data);
            const { card, boardId } = await cardService.create(cardData, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:created', card);
            callback?.({ ok: true, card });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('card:update', async (data, callback) => {
        try {
            const cardData = cardInputDto_1.updateCardInputSchema.parse(data);
            const { card, boardId } = await cardService.update(cardData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:updated', card);
            callback?.({ ok: true, card });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('card:delete', async (data, callback) => {
        try {
            const cardId = cardInputDto_1.deleteCardInputSchema.parse(data);
            const boardId = await cardService.delete(cardId, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:deleted', cardId);
            callback?.({ ok: true });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('card:fileAdd', async (data, callback) => {
        try {
            const { fileData, cardId } = await cardInputDto_1.addCardFileInputSchema.parseAsync(data);
            const { card, boardId } = await cardService.addFile(cardId, fileData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:fileAdded', card);
            callback?.({ ok: true, card });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
    socket.on('card:fileRemove', async (data, callback) => {
        try {
            const { cardId, filePath } = cardInputDto_1.removeCardFileInputSchema.parse(data);
            const { card, boardId } = await cardService.removeFile({ filePath, cardId }, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:fileRemoved', card);
            callback?.({ ok: true, card });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
        }
    });
}
