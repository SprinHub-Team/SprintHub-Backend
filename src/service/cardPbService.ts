import { CardPBRepository } from '../repository/cardPBRepository';
import { GroupRepository } from '../repository/groupRepository';
import { CardPbResponse } from '../dtos/response/cardPbResponseDto';
import { CreateCardPbInput, GetBacklogInput } from '../dtos/input/cardPbInputDto';
import { CardPbMapper } from '../mappers/cardPbMapper';
import AppError from '../errors/AppError';
export class CardPBService {

  constructor(
    private cardPBRepository: CardPBRepository,
    private readonly groupRepository: GroupRepository
  ) {}

  async create(data: CreateCardPbInput, userId: string): Promise<CardPbResponse> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }
    const card = await this.cardPBRepository.create(data);
    return CardPbMapper.toResponse(card);
  }
  async getBacklog(data: GetBacklogInput, userId: string): Promise<CardPbResponse[]> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }
    const cards = await this.cardPBRepository.findBacklogByGroup(
      data.groupId,
      data.search,
      data.assignedTo
    );
    return cards.map(card => CardPbMapper.toResponse(card));
  }

  async delete(id: string, userId: string): Promise<CardPbResponse> {
    const cardPb = await this.cardPBRepository.findById(id);
    if (!cardPb) throw new AppError('Actividad no encontrada', 404);
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      cardPb.groupId.toString(),
      userId,
      ['admin'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }
    const deleted = await this.cardPBRepository.delete(id);
    if (!deleted) throw new AppError('Actividad no encontrada', 404);
    return CardPbMapper.toResponse(deleted);
  }

  async exportBacklogToCsv(groupId: string, userId: string): Promise<string> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }
    const cards = await this.cardPBRepository.findBacklogByGroup(groupId);
    const header = 'Titulo,Descripcion,Prioridad,Asignado,Fecha de Vencimiento\n';
    const rows = cards.map(card => {
        const title = `'${card.title || ''}'`;
        const desc = `'${card.description || ''}'`;
        const priority = `${card.priority || 'media'}`;
        const assignedTo = card.assignedTo ? `'${card.assignedTo.name || 'Desconocido'}'` : 'Sin asignar';
        const dueDate = card.dueDate ? `'${card.dueDate.toISOString().split('T')[0]}'` : '';
        return `${title},${desc},${priority},${assignedTo},${dueDate}`;
    });
    return header + rows.join('\n');
  }
  
}