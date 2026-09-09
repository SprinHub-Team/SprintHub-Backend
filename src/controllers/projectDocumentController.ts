import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ProjectDocumentService } from '../service/projectDocumentService';

export class ProjectDocumentController {
  constructor(private readonly docService: ProjectDocumentService) {}

  async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const { title } = req.body;
      const file = req.file;
      const userId = req.user?.userId;

      if (!file) throw new Error('No se subió ningún archivo');
      if (!userId) throw new Error('No autorizado');
      if (!title) throw new Error('El título es requerido');

      const fileUrl = `/uploads/${file.filename}`;
      const doc = await this.docService.createDocument({
        title,
        fileName: file.originalname,
        fileUrl,
        groupId: groupId as string,
        uploadedBy: userId
      });

      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const userId = req.user?.userId;

      if (!userId) throw new Error('No autorizado');

      const docs = await this.docService.getDocumentsByGroupId(groupId as string, userId);
      res.json(docs);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) throw new Error('No autorizado');

      await this.docService.deleteDocument(id as string, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
