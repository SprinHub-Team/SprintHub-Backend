import {Request, Response, NextFunction} from 'express';
import { CardService } from '../service/CardService';
import { cardSchemaOutId } from '../dtos/CardDto';
import {mongoIdSchema} from '../utils/idValidator'
import { AuthRequest } from '../middlewares/authMiddleware';

export class CardController{

constructor(
  private cardService: CardService
){}

async findByColumnId(req: Request, res: Response, next: NextFunction){

  try{

    const columnId = mongoIdSchema.parse(req.params.column || req.params.id);

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

async create(req: Request, res: Response, next: NextFunction){

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

async update(req: Request, res: Response, next: NextFunction){

  try{

    const data = cardSchemaOutId.partial().parse(req.body);

    const cardId = mongoIdSchema.parse(req.params.id);

    const card = await this.cardService.update(
      cardId, data
    );

    return res.status(200).json({
      message: "Tarjeta actualizada correctamente",
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

  async uploadAttachment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = req.file;
      const userId = req.user?.userId;

      if (!file) throw new Error('No se subió ningún archivo');
      if (!userId) throw new Error('No autorizado');

      // The file URL will be accessible via /uploads/filename
      const fileUrl = `/uploads/${file.filename}`;
      const attachmentData = {
        fileName: file.originalname,
        fileUrl,
        uploadedBy: userId
      };

      const updatedCard = await this.cardService.addAttachment(id as string, attachmentData);
      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }

  async removeAttachment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, attachmentId } = req.params;
      const updatedCard = await this.cardService.removeAttachment(id as string, attachmentId as string);
      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }
}