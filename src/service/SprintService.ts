import { SprintRepository } from "../repository/sprintRepository";
import { CardPBRepository } from "../repository/CardPBRepository";
import { CardRepository } from "../repository/cardRepository";
import { ISprint } from "../models/Sprint";


export class SprintService {
    constructor(
        private sprintRepository: SprintRepository,
        private cardPBRepository: CardPBRepository,
        private cardRepository: CardRepository
    ){}

    async createSprint(data: Partial<ISprint>): Promise<ISprint>{
        if(!data.name || !data.startDate || !data.endDate || !data.groupId) {
            throw new Error('Nombre, fechas y grupo son obligatorios');
        }
        return await this.sprintRepository.create(data);
    }

    async getSprintsByGroup(groupId: string): Promise<ISprint[]> {
        return await this.sprintRepository.findByGroup(groupId);
    }

    async moveCardToSprint(cardId: string, sprintId: string | null){
        if(sprintId){
            const sprint = await this.sprintRepository.findById(sprintId);
            if(!sprintId) throw new Error('El sprint destino no existe');
        }
        const updatedCard = await this.cardPBRepository.updateSprint(cardId, sprintId);
        if(!updatedCard) throw new Error('Actividad no encontrada');

        return updatedCard;
    }

    async getCardsInSprint(sprintId: string){
        return await this.cardPBRepository.findBySprint(sprintId);
    }

    async exportToBoard(cardPbId: string, columnId: string){
        const cardPb = await this.cardPBRepository.findById(cardPbId);
        if (!cardPb) throw new Error('La actividad no existe en el Sprint/Backlog');

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
        const newCard = await this.cardRepository.create(newCardData as any);
        await this.cardPBRepository.delete(cardPbId);
        return newCard;


    }

}