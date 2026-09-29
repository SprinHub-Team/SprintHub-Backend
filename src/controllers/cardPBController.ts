import { Request, Response, NextFunction } from 'express';
import { CardPBService } from '../service/cardPbService';
import {
  createCardPbInputSchema,
  getBacklogInputSchema,
  deleteCardPbInputSchema,
  exportBacklogCsvInputSchema,
} from '../dtos/input/cardPbInputDto';

export class CardPBController {

  constructor(private cardPBService: CardPBService) {}

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