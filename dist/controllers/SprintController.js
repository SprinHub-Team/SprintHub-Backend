"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintController = void 0;
const idValidator_1 = require("../utils/idValidator");
class SprintController {
    sprintService;
    constructor(sprintService) {
        this.sprintService = sprintService;
    }
    async create(req, res) {
        try {
            const sprint = await this.sprintService.createSprint(req.body);
            return res.status(201).json(sprint);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getByGroup(req, res) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const sprints = await this.sprintService.getSprintsByGroup(groupId);
            return res.status(200).json(sprints);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async moveCard(req, res) {
        try {
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.cardId);
            const sprintId = req.body.sprintId ? idValidator_1.mongoIdSchema.parse(req.body.sprintId) : null;
            const card = await this.sprintService.moveCardToSprint(cardId, sprintId);
            return res.status(200).json(card);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getSprintCards(req, res) {
        try {
            const sprintId = idValidator_1.mongoIdSchema.parse(req.params.sprintId);
            const cards = await this.sprintService.getCardsInSprint(sprintId);
            return res.status(200).json(cards);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async exportToBoard(req, res) {
        try {
            const cardId = idValidator_1.mongoIdSchema.parse(req.params.cardId);
            const columnId = idValidator_1.mongoIdSchema.parse(req.body.columnId);
            if (!columnId) {
                return res.status(400).json({ message: 'el columnId es obligatorio' });
            }
            const newCard = await this.sprintService.exportToBoard(cardId, columnId);
            return res.status(200).json({ message: 'actividad exportada correctamente al tablero exitosamente', data: newCard });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.SprintController = SprintController;
