import { Request, Response } from 'express';
import { SprintService } from '../service/sprintService';
import { mongoIdSchema } from '../utils/idValidator';

export class SprintController{
    constructor(private sprintService: SprintService){}

    async create(req: Request, res: Response){
        try{
            const sprint = await this.sprintService.createSprint(req.body);
            return res.status(201).json(sprint);
        } catch (error: any){
            return res.status(400).json({message: error.message});
        }

    }

    async getByGroup(req: Request, res: Response){
        try{
            const groupId = mongoIdSchema.parse(req.params.id);
            const sprints = await this.sprintService.getSprintsByGroup(groupId);
            return res.status(200).json(sprints);
        } catch (error: any){
            return res.status(400).json({ message: error.message });
        }
    }

    async moveCard(req: Request, res: Response){
        try{
            const sprintId  = mongoIdSchema.parse(req.params.id);
            const cards = await this.sprintService.getCardsInSprint(sprintId);
            return res.status(200).json(cards);
        } catch (error: any){
            return res.status(400).json({message: error.message});
        }
    }

    async getSprintCards(req: Request, res: Response){
        try{
            const sprintId  = mongoIdSchema.parse(req.params.id);
            const cards = await this.sprintService.getCardsInSprint(sprintId);
            return res.status(200).json(cards);
        } catch (error: any) {
            return res.status(400).json({message: error.message});
        }
    }

    async exportToBoard(req: Request, res: Response){
        try{
            const cardId  = mongoIdSchema.parse(req.params.cardId);
            const columnId  = mongoIdSchema.parse(req.params.columnId);

            if(!columnId){
                return res.status(400).json({message: "el columnId es obligatorio"});
            }
            const newCard = await this.sprintService.exportToBoard(
                cardId,
                columnId
            );
            return res.status(200).json({message: "actividad exportada correctamente al tablero exitosamente", data: newCard});
            
        } catch (error: any){
            return res.status(400).json({message: error.message});
        }
    }

}