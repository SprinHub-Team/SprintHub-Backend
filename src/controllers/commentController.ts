import {Request, Response, NextFunction} from 'express';
import { CommentService } from '../service/commentService';
import {mongoIdSchema} from '../utils/idValidator'

export class CommentController{

constructor(
  private commentService: CommentService
){}

async findByCardId(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const cardId = mongoIdSchema.parse(req.params.id);

    const comments = await this.commentService.findByCardId(cardId, userId);

    return res.status(200).json(comments);

  }catch(error){
    next(error);
  }

}

async getCommentWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const commentId = mongoIdSchema.parse(req.params.id);

    const comment = await this.commentService.getCommentWhitDetails(commentId, userId);

    return res.status(200).json(comment);

  }catch(error){
    next(error);
  }

}

}