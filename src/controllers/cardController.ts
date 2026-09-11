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

  async uploadAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = mongoIdSchema.parse(req.params.id);
      const file = req.file;
      const userId = req.user.userId;

      if (!file) throw new Error('No se subió ningún archivo');
      if (!userId) throw new Error('No autorizado');

      const fileUrl = `/uploads/${file.filename}`;
      const attachmentData = {
        fileName: file.originalname,
        fileUrl,
        uploadedBy: userId
      };

      const updatedCard = await this.cardService.addAttachment(id, attachmentData);
      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }

  async removeAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const attachmentId = mongoIdSchema.parse(req.params.attachmentId);
      const id = mongoIdSchema.parse(req.params.id);
      const updatedCard = await this.cardService.removeAttachment(id, attachmentId);
      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }
  
}