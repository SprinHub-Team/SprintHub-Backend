import {Request, Response, NextFunction} from 'express';
import { CardService } from '../service/cardService';
import {mongoIdSchema} from '../utils/idValidator'

export class CardController{

constructor(
  private cardService: CardService
){}

async findByColumnId(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const columnId = mongoIdSchema.parse(req.params.id);

    const cards = await this.cardService.findByColumnId(columnId, userId);

    return res.status(200).json(cards);

  }catch(error){
    next(error);
  }

}

async getCardWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const cardId = mongoIdSchema.parse(req.params.id);

    const card = await this.cardService.getCardWhitDetails(cardId, userId);

    return res.status(200).json(card);

  }catch(error){
    next(error);
  }

}

}