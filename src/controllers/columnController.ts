import {Request, Response, NextFunction} from 'express';
import { ColumnService } from '../service/columnService';
import { createColumnSchema, updateColumnSchema } from '../dtos/ColumnDto';
import {mongoIdSchema} from '../utils/idValidator'

export class ColumnController{

constructor(
  private columnService: ColumnService
){}

async findByBoardId(req: Request, res: Response, next: NextFunction){

  try{

    const boardId = mongoIdSchema.parse(req.params.id);

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

async create(req: Request, res: Response, next: NextFunction){

  try{

    const data = createColumnSchema.parse(req.body);

    const column = await this.columnService.create(data);

    return res.status(201).json({
      mesagge: "Columna creado correctamente",
      data: column
    });

  }catch(error){
    next(error);
  }

}

async update(req: Request, res: Response, next: NextFunction){

  try{

    const data = updateColumnSchema.parse(req.body);

    const columnId = mongoIdSchema.parse(req.params.id);

    const column = await this.columnService.update(
      columnId, data
    );

    return res.status(200).json({
      message: "Columna actulizada correctamente",
      data: column
    });

  }catch(error){
    next(error);
  }

}

async delete(req: Request, res: Response, next: NextFunction){

  try{

   const columnId = mongoIdSchema.parse(req.params.id);

   await this.columnService.delete(columnId);

   return res.status(204).send();

  }catch(error){
    next(error);
  }

}

}