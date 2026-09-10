import { Request, Response } from 'express';
import { CardPBService } from '../service/CardPBService';

export class CardPBController {
  constructor(private cardPBService: CardPBService) {}

  async create(req: Request, res: Response) {
    try {
      const newCard = await this.cardPBService.create(req.body);
      return res.status(201).json(newCard);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBacklog(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { search, assignedTo } = req.query;
      const cards = await this.cardPBService.getBacklog(
        groupId as string, 
        search as string, 
        assignedTo as string
      );
      return res.status(200).json(cards);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.cardPBService.delete(id as string);
      return res.status(200).json({ message: 'Actividad eliminada', data: deleted });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async exportCsv(req: Request, res: Response){
    try{
      const { groupId } = req.params;
      const csvData = await this.cardPBService.exportBacklogToCsv(groupId as string);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=backlog_actividades.csv');
      return res.status(200).send(csvData);
    } catch (error: any){
      return res.status(400).json({message: error.message});
    }
  }

}