"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPBService = void 0;
class CardPBService {
    cardPBRepository;
    constructor(cardPBRepository) {
        this.cardPBRepository = cardPBRepository;
    }
    async create(data) {
        if (!data.title || !data.groupId) {
            throw new Error('El título y el grupo (groupId) son obligatorios');
        }
        return await this.cardPBRepository.create(data);
    }
    async getBacklog(groupId, search, assignedTo) {
        if (!groupId) {
            throw new Error('El groupId es obligatorio para buscar el backlog');
        }
        return await this.cardPBRepository.findBacklogByGroup(groupId, search, assignedTo);
    }
    async delete(id) {
        const deleted = await this.cardPBRepository.delete(id);
        if (!deleted)
            throw new Error('Actividad no encontrada');
        return deleted;
    }
    async exportBacklogToCsv(groupId) {
        if (!groupId)
            throw new Error('El grupo es obligatorio');
        const cards = await this.cardPBRepository.findBacklogByGroup(groupId);
        const header = 'Titulo,Descripcion,Prioridad,Asignado,Fecha de Vencimiento\n';
        const rows = cards.map(card => {
            const title = `"${card.title || ''}"`;
            const desc = `"${card.description || ''}"`;
            const priority = `"${card.priority || 'media'}"`;
            const assignedTo = card.assignedTo ? `"${card.assignedTo.name || 'Desconocido'}"` : '"Sin asignar"';
            const dueDate = card.dueDate ? `"${card.dueDate.toISOString().split('T')[0]}"` : '""';
            return `${title},${desc},${priority},${assignedTo},${dueDate}`;
        });
        return header + rows.join('\n');
    }
}
exports.CardPBService = CardPBService;
