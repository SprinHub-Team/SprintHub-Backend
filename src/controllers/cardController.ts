import {Request, Response, NextFunction} from 'express';
import { CardService } from '../service/CardService';
import { cardSchemaOutId } from '../dtos/CardDto';
import {mongoIdSchema} from '../utils/idValidator'

export class CardController{

constructor(
  private cardService: CardService
){}

findByColumnId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const columnId = mongoIdSchema.parse(req.params.id);
    const columns = await this.cardService.findByColumnId(columnId);
    return res.status(200).json({
      data: columns
    });
  }catch(error){
    next(error);
  }
}

findByBoardId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const boardId = mongoIdSchema.parse(req.params.boardId);
    const cards = await this.cardService.findByBoardId(boardId);
    return res.status(200).json({
      data: cards
    });
  }catch(error){
    next(error);
  }
}

getCardWhitDetails = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const cardId = mongoIdSchema.parse(req.params.id);
    const card = await this.cardService.getCardWhitDetails(cardId);
    return res.status(200).json({
      data: card
    });
  }catch(error){
    next(error);
  }
}

create = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = cardSchemaOutId.parse(req.body);
    const card = await this.cardService.create(data);
    return res.status(201).json({
      message: "Tarjeta creada correctamente",
      data: card
    });
  }catch(error){
    next(error);
  }
}

update = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = cardSchemaOutId.partial().parse(req.body);
    const cardId = mongoIdSchema.parse(req.params.id);
    const card = await this.cardService.update(cardId, data);
    return res.status(200).json({
      message: "Tarjeta actualizada correctamente",
      data: card
    });
  }catch(error){
    next(error);
  }
}

delete = async (req: Request, res: Response, next: NextFunction) => {
  try{
   const cardId = mongoIdSchema.parse(req.params.id);
   await this.cardService.delete(cardId);
   return res.status(204).send();
  }catch(error){
    next(error);
  }
}

}