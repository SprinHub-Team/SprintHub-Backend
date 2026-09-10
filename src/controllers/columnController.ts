import {Request, Response, NextFunction} from 'express';
import { ColumnService } from '../service/columnService';
import {mongoIdSchema} from '../utils/idValidator'

export class ColumnController{

constructor(
  private columnService: ColumnService
){}

async findByBoardId(req: Request, res: Response, next: NextFunction){

  try{

    const boardId = mongoIdSchema.parse(req.params.boardId);

    const columns = await this.columnService.findByBoardId(boardId);

    return res.status(200).json({
      data: columns
    });

  }catch(error){
    next(error);
  }

}

async getColumnWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const columnId = mongoIdSchema.parse(req.params.id);

    const column = await this.columnService.getColumnWhitDetails(columnId);

    return res.status(200).json({
      data: column
    });

  }catch(error){
    next(error);
  }

}

}