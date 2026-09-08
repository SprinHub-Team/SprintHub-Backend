"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintService = void 0;
class SprintService {
    sprintRepository;
    cardPBRepository;
    cardRepository;
    constructor(sprintRepository, cardPBRepository, cardRepository) {
        this.sprintRepository = sprintRepository;
        this.cardPBRepository = cardPBRepository;
        this.cardRepository = cardRepository;
    }
    async createSprint(data) {
        if (!data.name || !data.startDate || !data.endDate || !data.groupId) {
            throw new Error('Nombre, fechas y grupo son obligatorios');
        }
        return await this.sprintRepository.create(data);
    }
    async getSprintsByGroup(groupId) {
        return await this.sprintRepository.findByGroup(groupId);
    }
    async moveCardToSprint(cardId, sprintId) {
        if (sprintId) {
            const sprint = await this.sprintRepository.findById(sprintId);
            if (!sprintId)
                throw new Error('El sprint destino no existe');
        }
        const updatedCard = await this.cardPBRepository.updateSprint(cardId, sprintId);
        if (!updatedCard)
            throw new Error('Actividad no encontrada');
        return updatedCard;
    }
    async getCardsInSprint(sprintId) {
        return await this.cardPBRepository.findBySprint(sprintId);
    }
    async exportToBoard(cardPbId, columnId) {
        const cardPb = await this.cardPBRepository.findById(cardPbId);
        if (!cardPb)
            throw new Error('La actividad no existe en el Sprint/Backlog');
        const newCardData = {
            title: cardPb.title,
            description: cardPb.description,
            groupId: cardPb.groupId,
            columnId: columnId,
            assignedTo: cardPb.assignedTo,
            dueDate: cardPb.dueDate,
            priority: cardPb.priority,
            tasks: cardPb.tasks
        };
        const newCard = await this.cardRepository.create(newCardData);
        await this.cardPBRepository.delete(cardPbId);
        return newCard;
    }
}
exports.SprintService = SprintService;
