import {Request, Response, NextFunction} from 'express';
import { CommentService } from '../service/CommentService';
import { createCommentSchema, updateCommentSchema } from '../dtos/CommentDto';
import {mongoIdSchema} from '../utils/idValidator'

export class CommentController{

constructor(
  private commentService: CommentService
){}

async findByCardId(req: Request, res: Response, next: NextFunction){

  try{

    const cardId = mongoIdSchema.parse(req.params.card || req.params.id);

    const comments = await this.commentService.findByCardId(cardId);

    return res.status(200).json({
      data: comments
    });

  }catch(error){
    next(error);
  }

}

async getCommentWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const commentId = mongoIdSchema.parse(req.params.id);

    const comment = await this.commentService.getCommentWhitDetails(commentId);

    return res.status(200).json({
      data: comment
    });

  }catch(error){
    next(error);
  }

}

async create(req: Request, res: Response, next: NextFunction){

  try{

    const data = createCommentSchema.parse(req.body);

    const comment = await this.commentService.create(data);

    return res.status(201).json({
      message: "Comentario creado correctamente",
      data: comment
    });

  }catch(error){
    next(error);
  }

}

async update(req: Request, res: Response, next: NextFunction){

  try{

    const data = updateCommentSchema.parse(req.body);

    const commentId = mongoIdSchema.parse(req.params.id);

    const comment = await this.commentService.update(
      commentId, data
    );

    return res.status(200).json({
      message: "Tablero actulizado correctamente",
      data: comment
    });

  }catch(error){
    next(error);
  }

}

async delete(req: Request, res: Response, next: NextFunction){

  try{

   const commentId = mongoIdSchema.parse(req.params.id);

   await this.commentService.delete(commentId);

   return res.status(204).send();

  }catch(error){
    next(error);
  }

}

}