import { GroupRepository } from '../repository/groupRepository';
import SupabaseStorageService from './storage/supabaseStorageService';
import { ProjectDocumentResponse } from '../dtos/response/projectDocumentResponseDto';
import { UploadProjectDocumentInput } from '../dtos/input/projectDocumentInputDto';
import { ProjectDocumentMapper } from '../mappers/projectDocumentMapper';
import AppError from '../errors/AppError';
import { ProjectDocumentRepository } from '../repository/projectDocumentRepository';
export class ProjectDocumentService {

  constructor(
    private readonly docRepo: ProjectDocumentRepository,
    private readonly groupRepo: GroupRepository,
    private readonly supabaseStorageService: SupabaseStorageService
  ) {}

  async createDocument(
    data: UploadProjectDocumentInput,
    userId: string
  ): Promise<ProjectDocumentResponse> {

    const groupExists = await this.groupRepo.existById(data.groupId);
    if (!groupExists) throw new AppError('Grupo no encontrado', 404);
    const hasPermission = await this.groupRepo.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('Solo administradores y colaboradores pueden subir documentos', 403);
    }
    const file = await this.supabaseStorageService.upload({ ...data.fileData, path: 'ProjectsDocuments' });
    try {
      const doc = await this.docRepo.create({
        title: data.title,
        fileName: data.fileData.fileName,
        fileUrl: file.url,
        filePath: file.path,
        groupId: data.groupId,
        uploadedBy: userId
      });
      return ProjectDocumentMapper.toResponse(doc);
    } catch (error: unknown) {
      await this.supabaseStorageService.delete(file.path);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new AppError(`No se ha podido registrar el documento: ${errorMessage}`, 500);
    }

  }

  async getDocumentsByGroupId(groupId: string, userId: string): Promise<ProjectDocumentResponse[]> {

    const groupExists = await this.groupRepo.existById(groupId);
    if (!groupExists) throw new AppError('Grupo no encontrado', 404);
    const hasPermission = await this.groupRepo.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('No tienes acceso a este grupo', 403);
    }
    const docs = await this.docRepo.findByGroupId(groupId);
    return docs.map(doc => ProjectDocumentMapper.toResponse(doc));

  }

  async deleteDocument(id: string, userId: string): Promise<void> {

    const doc = await this.docRepo.findById(id);
    if (!doc) throw new AppError('Documento no encontrado', 404);
    const hasPermission = await this.groupRepo.isMemberAndRoleValid(
      doc.groupId.toString(),
      userId,
      ['admin', 'collaborator'],
    );

    if (!hasPermission) {
      throw new AppError('Solo administradores y colaboradores pueden eliminar documentos', 403);
    }
    
    const deleted = await this.docRepo.delete(id);
    if (!deleted) throw new AppError('Documento no encontrado', 404);
    if (deleted.filePath) {
      await this.supabaseStorageService.delete(deleted.filePath);
    }
  }

}