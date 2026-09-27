import {Request, Response, NextFunction} from 'express';
import { ColumnService } from '../service/columnService';
import {mongoIdSchema} from '../utils/idValidator'

export class ColumnController{

constructor(
  private columnService: ColumnService
){}

async findByBoardId(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const boardId = mongoIdSchema.parse(req.params.boardId);

    const columns = await this.columnService.findByBoardId(boardId, userId);

    return res.status(200).json(columns);

  }catch(error){
    next(error);
  }

}

async getColumnWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const userId = req.user.userId;

    const columnId = mongoIdSchema.parse(req.params.id);

    const column = await this.columnService.getColumnWhitDetails(columnId, userId);

    return res.status(200).json(column);

  }catch(error){
    next(error);
  }

}

}