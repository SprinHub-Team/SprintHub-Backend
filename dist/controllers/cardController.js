"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const CardDto_1 = require("../dtos/CardDto");
const idValidator_1 = require("../utils/idValidator");
class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    async findByColumnId(req, res, next) {
        try {
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.column || req.params.id);
            const cards = await this.cardService.findByColumnId(columnId);
            return res.status(200).json({
                data: cards
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findByBoardId(req, res, next) {
        try {
            const boardId = idValidator_1.mongoIdSchema.parse(req.params.boardId);
            const cards = await this.cardService.findByBoardId(boardId);
            return res.status(200).json({
                data: cards
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCardWhitDetails(req, res, next) {
        try {
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const card = await this.cardService.getCardWhitDetails(cardId);
            return res.status(200).json({
                data: card
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const data = CardDto_1.cardSchemaOutId.parse(req.body);
            const card = await this.cardService.create(data);
            return res.status(201).json({
                message: "Tarjeta creada correctamente",
                data: card
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const data = CardDto_1.cardSchemaOutId.partial().parse(req.body);
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const card = await this.cardService.update(cardId, data);
            return res.status(200).json({
                message: "Tarjeta actualizada correctamente",
                data: card
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            await this.cardService.delete(cardId);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async uploadAttachment(req, res, next) {
        try {
            const { id } = req.params;
            const file = req.file;
            const userId = req.user?.userId;
            if (!file)
                throw new Error('No se subió ningún archivo');
            if (!userId)
                throw new Error('No autorizado');
            // The file URL will be accessible via /uploads/filename
            const fileUrl = `/uploads/${file.filename}`;
            const attachmentData = {
                fileName: file.originalname,
                fileUrl,
                uploadedBy: userId
            };
            const updatedCard = await this.cardService.addAttachment(id, attachmentData);
            res.status(200).json(updatedCard);
        }
        catch (error) {
            next(error);
        }
    }
    async removeAttachment(req, res, next) {
        try {
            const { id, attachmentId } = req.params;
            const updatedCard = await this.cardService.removeAttachment(id, attachmentId);
            res.status(200).json(updatedCard);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CardController = CardController;
