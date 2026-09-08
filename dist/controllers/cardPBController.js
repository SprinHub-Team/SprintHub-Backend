"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPBController = void 0;
class CardPBController {
    cardPBService;
    constructor(cardPBService) {
        this.cardPBService = cardPBService;
    }
    async create(req, res) {
        try {
            const newCard = await this.cardPBService.create(req.body);
            return res.status(201).json(newCard);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getBacklog(req, res) {
        try {
            const { groupId } = req.params;
            const { search, assignedTo } = req.query;
            const cards = await this.cardPBService.getBacklog(groupId, search, assignedTo);
            return res.status(200).json(cards);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.cardPBService.delete(id);
            return res.status(200).json({ message: 'Actividad eliminada', data: deleted });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async exportCsv(req, res) {
        try {
            const { groupId } = req.params;
            const csvData = await this.cardPBService.exportBacklogToCsv(groupId);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=backlog_actividades.csv');
            return res.status(200).send(csvData);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.CardPBController = CardPBController;
