import {Request, Response, NextFunction} from 'express';
import { CardService } from '../service/cardService';
import {mongoIdSchema} from '../utils/idValidator'

export class CardController{

constructor(
  private cardService: CardService
){}

async findByColumnId(req: Request, res: Response, next: NextFunction){

  try{

    const columnId = mongoIdSchema.parse(req.params.id);

    const cards = await this.cardService.findByColumnId(columnId);

    return res.status(200).json({
      data: cards
    });

  }catch(error){
    next(error);
  }

}

async findByBoardId(req: Request, res: Response, next: NextFunction){

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

async getCardWhitDetails(req: Request, res: Response, next: NextFunction){

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

}