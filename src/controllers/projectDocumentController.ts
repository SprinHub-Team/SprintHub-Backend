import { Request, Response, NextFunction } from 'express';
import { ProjectDocumentService } from '../service/projectDocumentService';
import SupabaseStorageService from '../service/storage/supabaseStorageService';
import { ProjectDocumentMapper } from '../mappers/projectDocumentMapper';

export class ProjectDocumentController {
  constructor(
    private readonly docService: ProjectDocumentService,
    private readonly supabaseService: SupabaseStorageService
  ) {}

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const { title } = req.body;
      const file = req.file;
      const userId = req.user?.userId;

      if (!file) throw new Error('No se subió ningún archivo');
      if (!userId) throw new Error('No autorizado');
      if (!title) throw new Error('El título es requerido');

      const fileResult = await this.supabaseService.upload({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype, path: 'ProjectsDocuments'});

      const doc = await this.docService.createDocument({
        title,
        fileName: file.originalname,
        fileUrl: fileResult.url,
        groupId: groupId as string,
        uploadedBy: userId
      });

      res.status(201).json({ data: ProjectDocumentMapper.toResponse(doc) });
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const userId = req.user?.userId;

      if (!userId) throw new Error('No autorizado');

      const docs = await this.docService.getDocumentsByGroupId(groupId as string, userId);
      res.status(200).json({ data: docs.map(d => ProjectDocumentMapper.toResponse(d)) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) throw new Error('No autorizado');

      const fileUrl = await this.docService.deleteDocument(id as string, userId);
      
      // Attempt to delete from Supabase
      if (fileUrl) {
        try {
          const parts = fileUrl.split('/sprinthub-files/');
          if (parts.length > 1) {
            const filePath = parts[1];
            await this.supabaseService.delete(filePath);
          }
        } catch (e) {
          console.error('Error deleting from supabase:', e);
        }
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
