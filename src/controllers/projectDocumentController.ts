import { Request, Response, NextFunction } from 'express';
import { ProjectDocumentService } from '../service/projectDocumentService';
import {
  uploadProjectDocumentInputSchema,
  getProjectDocumentsInputSchema,
  deleteProjectDocumentInputSchema,
} from '../dtos/input/projectDocumentInputDto';
import AppError from '../errors/AppError';
export class ProjectDocumentController {

  constructor(
    private readonly docService: ProjectDocumentService
  ) {}

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const file = req.file;
      if (!file) throw new AppError('No se subió ningún archivo', 400);
      const data = await uploadProjectDocumentInputSchema.parseAsync({
        title: req.body.title,
        groupId: req.params.groupId,
        fileData: {
          fileName: file.originalname,
          buffer: file.buffer
        }
      });
      const doc = await this.docService.createDocument(data, userId);
      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { groupId } = getProjectDocumentsInputSchema.parse(req.params);
      const docs = await this.docService.getDocumentsByGroupId(groupId, userId);
      res.json(docs);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const id = deleteProjectDocumentInputSchema.parse(req.params.id);
      await this.docService.deleteDocument(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  
}