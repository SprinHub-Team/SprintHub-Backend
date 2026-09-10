import { CardPBRepository } from '../repository/CardPBRepository';
import { ICardPB } from '../models/CardPB';

export class CardPBService {
  constructor(private cardPBRepository: CardPBRepository) {}

  async create(data: Partial<ICardPB>): Promise<ICardPB> {
    if (!data.title || !data.groupId) {
      throw new Error('El título y el grupo (groupId) son obligatorios');
    }
    return await this.cardPBRepository.create(data);
  }

  async getBacklog(groupId: string, search?: string, assignedTo?: string): Promise<ICardPB[]> {
    if (!groupId) {
      throw new Error('El groupId es obligatorio para buscar el backlog');
    }
    return await this.cardPBRepository.findBacklogByGroup(groupId, search, assignedTo);
  }

  async delete(id: string): Promise<ICardPB | null> {
    const deleted = await this.cardPBRepository.delete(id);
    if (!deleted) throw new Error('Actividad no encontrada');
    return deleted;
  }

  async exportBacklogToCsv(groupId: string): Promise<string>{
    if(!groupId) throw new Error('El grupo es obligatorio');

    const cards = await this.cardPBRepository.findBacklogByGroup(groupId);
    const header = 'Titulo,Descripcion,Prioridad,Asignado,Fecha de Vencimiento\n';

    const rows = cards.map(card => {
        const title = `"${card.title || ''}"`;
        const desc = `"${card.description || ''}"`;
        const priority = `"${card.priority || 'media'}"`;
        const assignedTo = card.assignedTo ? `"${(card.assignedTo as any).name || 'Desconocido'}"` : '"Sin asignar"';
        const dueDate = card.dueDate ? `"${card.dueDate.toISOString().split('T')[0]}"` : '""';

        return `${title},${desc},${priority},${assignedTo},${dueDate}`;
    });
    return header + rows.join('\n');

  }


}