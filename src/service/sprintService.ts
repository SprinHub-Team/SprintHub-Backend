import { SprintRepository } from '../repository/sprintRepository';
import { CardPBRepository } from '../repository/cardPBRepository';
import { CardRepository } from '../repository/cardRepository';
import { ColumnRepository } from '../repository/columnRepository';
import { GroupRepository } from '../repository/groupRepository';
import { SprintResponse } from '../dtos/response/sprintResponseDto';
import { CardPbResponse } from '../dtos/response/cardPbResponseDto';
import { CardDetailsResponse } from '../dtos/response/cardResponseDto';
import {
  CreateSprintInput,
  MoveCardToSprintInput,
  ExportToBoardInput,
} from '../dtos/input/sprintInputDto';
import { SprintMapper } from '../mappers/sprintMapper';
import { CardPbMapper } from '../mappers/cardPbMapper';
import { CardMapper } from '../mappers/cardMapper';
import AppError from '../errors/AppError';
export class SprintService {
    
    constructor(
        private sprintRepository: SprintRepository,
        private cardPBRepository: CardPBRepository,
        private cardRepository: CardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly columnRepository: ColumnRepository
    ){}

    async createSprint(data: CreateSprintInput, userId: string): Promise<SprintResponse>{
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            data.groupId,
            userId,
            ['admin', 'collaborator'],
        );
        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const sprint = await this.sprintRepository.create(data);
        return SprintMapper.toResponse(sprint);
    }

    async getSprintsByGroup(groupId: string, userId: string): Promise<SprintResponse[]> {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            groupId,
            userId,
            ['admin', 'collaborator'],
        );
        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const sprints = await this.sprintRepository.findByGroup(groupId);
        return sprints.map(sprint => SprintMapper.toResponse(sprint));
    }

    async moveCardToSprint(data: MoveCardToSprintInput, userId: string): Promise<CardPbResponse> {
        const cardPb = await this.cardPBRepository.findById(data.cardId);
        if(!cardPb) throw new AppError('Actividad no encontrada', 404);
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            cardPb.groupId.toString(),
            userId,
            ['admin', 'collaborator'],
        );
        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        if(data.sprintId){
            const sprint = await this.sprintRepository.findById(data.sprintId);
            if(!sprint) throw new AppError('El sprint destino no existe', 404);
            if(sprint.groupId.toString() !== cardPb.groupId.toString()){
                throw new AppError('El sprint destino no pertenece al grupo de la actividad', 400);
            }
        }
        const updatedCard = await this.cardPBRepository.updateSprint(data.cardId, data.sprintId);
        if(!updatedCard) throw new AppError('Actividad no encontrada', 404);
        return CardPbMapper.toResponse(updatedCard);
    }

    async getCardsInSprint(sprintId: string, userId: string): Promise<CardPbResponse[]> {
        const sprint = await this.sprintRepository.findById(sprintId);
        if(!sprint) throw new AppError('El sprint consultado no existe', 404);
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            sprint.groupId.toString(),
            userId,
            ['admin', 'collaborator'],
        );
        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const cards = await this.cardPBRepository.findBySprint(sprintId);
        return cards.map(card => CardPbMapper.toResponse(card));
    }

    async exportToBoard(data: ExportToBoardInput, userId: string): Promise<CardDetailsResponse> {
        const cardPb = await this.cardPBRepository.findById(data.cardId);
        if (!cardPb) throw new AppError('La actividad no existe en el Sprint/Backlog', 404);
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            cardPb.groupId.toString(),
            userId,
            ['admin', 'collaborator'],
        );
        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if (!columnContext) throw new AppError('La columna destino no existe', 404);
        if (columnContext.groupId !== cardPb.groupId.toString()) {
            throw new AppError('La columna destino no pertenece al grupo de la actividad', 400);
        }
        const assignedToId = cardPb.assignedTo ? cardPb.assignedTo._id.toString() : undefined;
        const newCard = await this.cardRepository.create({
            title: cardPb.title,
            description: cardPb.description,
            columnId: data.columnId,
            assignedTo: assignedToId,
            dueDate: cardPb.dueDate ?? undefined,
            priority: cardPb.priority,
        });
        await this.cardPBRepository.delete(data.cardId);
        return CardMapper.toDetailsResponse(newCard);
    }

}