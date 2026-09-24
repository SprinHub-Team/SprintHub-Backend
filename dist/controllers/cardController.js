"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const idValidator_1 = require("../utils/idValidator");
class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    async findByColumnId(req, res, next) {
        try {
            const userId = req.user.userId;
            const columnId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const cards = await this.cardService.findByColumnId(columnId, userId);
            return res.status(200).json(cards);
        }
        catch (error) {
            next(error);
        }
    }
    async getCardWhitDetails(req, res, next) {
        try {
            const userId = req.user.userId;
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const card = await this.cardService.getCardWhitDetails(cardId, userId);
            return res.status(200).json(card);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CardController = CardController;
