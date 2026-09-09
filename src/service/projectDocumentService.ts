import { ProjectDocumentRepository } from '../repository/projectDocumentRepository';
import { GroupRepository } from '../repository/groupRepository';
import AppError from '../errors/AppError';

export class ProjectDocumentService {
  constructor(
    private readonly docRepo: ProjectDocumentRepository,
    private readonly groupRepo: GroupRepository
  ) {}

  async createDocument(data: { title: string; fileName: string; fileUrl: string; groupId: string; uploadedBy: string }) {
    const group = await this.groupRepo.findById(data.groupId);
    if (!group) throw new AppError('Grupo no encontrado', 404);

    const member = group.members.find(m => m.user._id?.toString() === data.uploadedBy || m.user.toString() === data.uploadedBy);
    if (!member || (member.role !== 'admin' && member.role !== 'collaborator' && group.ownerId._id?.toString() !== data.uploadedBy)) {
      throw new AppError('Solo administradores y colaboradores pueden subir documentos', 403);
    }

    return this.docRepo.create(data);
  }

  async getDocumentsByGroupId(groupId: string, userId: string) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new AppError('Grupo no encontrado', 404);

    const isMember = group.members.some(m => m.user._id?.toString() === userId || m.user.toString() === userId) || group.ownerId._id?.toString() === userId;
    if (!isMember) throw new AppError('No tienes acceso a este grupo', 403);

    return this.docRepo.findByGroupId(groupId);
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await this.docRepo.findById(id);
    if (!doc) throw new AppError('Documento no encontrado', 404);

    const group = await this.groupRepo.findById(doc.groupId.toString());
    if (!group) throw new AppError('Grupo no encontrado', 404);

    const member = group.members.find(m => m.user._id?.toString() === userId || m.user.toString() === userId);
    if (!member || (member.role !== 'admin' && member.role !== 'collaborator' && group.ownerId._id?.toString() !== userId)) {
      throw new AppError('Solo administradores y colaboradores pueden eliminar documentos', 403);
    }

    return this.docRepo.delete(id);
  }
}
