"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardPBController = void 0;
const CardPBRepository_1 = require("../repository/CardPBRepository");
const CardPBService_1 = require("../service/CardPBService");
const cardPBController_1 = require("../controllers/cardPBController");
const cardPBRepository = new CardPBRepository_1.CardPBRepository();
const cardPBService = new CardPBService_1.CardPBService(cardPBRepository);
exports.cardPBController = new cardPBController_1.CardPBController(cardPBService);
