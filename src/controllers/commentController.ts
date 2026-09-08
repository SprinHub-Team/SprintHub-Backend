import {Request, Response, NextFunction} from 'express';
import { CommentService } from '../service/commentService';
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

}