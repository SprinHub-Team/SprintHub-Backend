import { Request, Response, NextFunction } from 'express';
import { SprintService } from '../service/sprintService';
import {
  createSprintInputSchema,
  getSprintsByGroupInputSchema,
  moveCardToSprintInputSchema,
  getSprintCardsInputSchema,
  exportToBoardInputSchema,
} from '../dtos/input/sprintInputDto';
export class SprintController{

    constructor(private sprintService: SprintService){}

    async create(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.user.userId;
            const data = createSprintInputSchema.parse(req.body);
            const sprint = await this.sprintService.createSprint(data, userId);
            return res.status(201).json(sprint);
        } catch (error){
            next(error);
        }
    }

    async getByGroup(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.user.userId;
            const { groupId } = getSprintsByGroupInputSchema.parse(req.params);
            const sprints = await this.sprintService.getSprintsByGroup(groupId, userId);
            return res.status(200).json(sprints);
        } catch (error){
            next(error);
        }
    }

    async moveCard(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.user.userId;
            const data = moveCardToSprintInputSchema.parse({
                cardId: req.params.cardId,
                sprintId: req.body.sprintId,
            });
            const card = await this.sprintService.moveCardToSprint(data, userId);
            return res.status(200).json(card);
        } catch (error){
            next(error);
        }
    }

    async getSprintCards(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.user.userId;
            const { sprintId } = getSprintCardsInputSchema.parse(req.params);
            const cards = await this.sprintService.getCardsInSprint(sprintId, userId);
            return res.status(200).json(cards);
        } catch (error) {
            next(error);
        }
    }

    async exportToBoard(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.user.userId;
            const data = exportToBoardInputSchema.parse({
                cardId: req.params.cardId,
                columnId: req.body.columnId,
            });
            const newCard = await this.sprintService.exportToBoard(data, userId);
            return res.status(200).json({message: 'actividad exportada correctamente al tablero exitosamente', data: newCard});
        } catch (error){
            next(error);
        }
    }
    
}