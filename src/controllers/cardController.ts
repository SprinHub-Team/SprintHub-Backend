import {Request, Response, NextFunction} from 'express';
import { CardService } from '../service/cardService';
import { cardSchemaOutId } from '../dtos/CardDto';
import {mongoIdSchema} from '../utils/idValidator'

export class CardController{

constructor(
  private cardService: CardService
){}

async findByColumnId(req: Request, res: Response, next: NextFunction){

  try{

    const boardId = mongoIdSchema.parse(req.params.id);

    const columns = await this.cardService.findByColumnId(boardId);

    return res.status(200).json({
      data: columns
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

async create(req: Request, res: Response, next: NextFunction){

  try{

    const data = cardSchemaOutId.parse(req.body);

    const card = await this.cardService.create(data);

    return res.status(201).json({
      mesagge: "Tarjeta creada correctamente",
      data: card
    });

  }catch(error){
    next(error);
  }

}

async update(req: Request, res: Response, next: NextFunction){

  try{

    const data = cardSchemaOutId.parse(req.body);

    const cardId = mongoIdSchema.parse(req.params.id);

    const card = await this.cardService.update(
      cardId, data
    );

    return res.status(200).json({
      message: "Card actulizada correctamente",
      data: card
    });

  }catch(error){
    next(error);
  }

}

async delete(req: Request, res: Response, next: NextFunction){

  try{

   const cardId = mongoIdSchema.parse(req.params.id);

   await this.cardService.delete(cardId);

   return res.status(204).send();

  }catch(error){
    next(error);
  }

}

}