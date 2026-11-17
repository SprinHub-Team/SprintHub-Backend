import { mongoIdSchema } from '../utils/idValidator';
import { Request, Response, NextFunction } from 'express';
import { CardPBService } from '../service/cardPbService';
import {
  createCardPbInputSchema, updateCardPbInputSchema, reorderBacklogInputSchema,
  getBacklogInputSchema,
  deleteCardPbInputSchema,
  exportBacklogCsvInputSchema,
} from '../dtos/input/cardPbInputDto';

export class CardPBController {

  constructor(private cardPBService: CardPBService) {}

  async getPlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = mongoIdSchema.parse(req.params.groupId);
      res.json(await this.cardPBService.getPlanning(groupId, req.user.userId));
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = reorderBacklogInputSchema.parse(req.body);
      await this.cardPBService.reorder(data.groupId, data.sprintId, data.ids, req.user.userId);
      res.status(204).end();
    } catch (error) { next(error); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json(await this.cardPBService.update(deleteCardPbInputSchema.parse(req.params.id), updateCardPbInputSchema.parse(req.body), req.user.userId)); }
    catch (error) { next(error); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const data = createCardPbInputSchema.parse(req.body);
      const newCard = await this.cardPBService.create(data, userId);
      return res.status(201).json(newCard);
    } catch (error) {
      next(error);
    }
  }

  async getBacklog(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const data = getBacklogInputSchema.parse({
        groupId: req.params.groupId,
        search: req.query.search,
        assignedTo: req.query.assignedTo,
      });
      const cards = await this.cardPBService.getBacklog(data, userId);
      return res.status(200).json(cards);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const id = deleteCardPbInputSchema.parse(req.params.id);
      const deleted = await this.cardPBService.delete(id, userId);
      return res.status(200).json({ message: 'Actividad eliminada', data: deleted });
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction){
    try{
      const userId = req.user.userId;
      const groupId = exportBacklogCsvInputSchema.parse(req.params.groupId);
      const csvData = await this.cardPBService.exportBacklogToCsv(groupId, userId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=backlog_actividades.csv');
      return res.status(200).send(csvData);
    } catch (error){
      next(error);
    }
  }
  
}