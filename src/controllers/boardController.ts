import {Request, Response, NextFunction} from 'express';
import { BoardService } from '../service/boardService';
import { createBoardSchema, updateBoardSchema } from '../dtos/BoardDto';
import {mongoIdSchema} from '../utils/idValidator'

export class BoardController{

constructor(
  private boardService: BoardService
){}

async findByGroupId(req: Request, res: Response, next: NextFunction){

  try{

    const groupId = mongoIdSchema.parse(req.params.id);

    const boards = await this.boardService.findByGroupId(groupId);

    return res.status(200).json({
      data: boards
    });

  }catch(error){
    next(error);
  }

}

async getBoardWhitDetails(req: Request, res: Response, next: NextFunction){

  try{

    const boardId = mongoIdSchema.parse(req.params.id);

    const board = await this.boardService.getBoardWhitDetails(boardId);

    return res.status(200).json({
      data: board
    });

  }catch(error){
    next(error);
  }

}

async create(req: Request, res: Response, next: NextFunction){

  try{

    const data = createBoardSchema.parse(req.body);

    const board = await this.boardService.create(data);

    return res.status(201).json({
      mesagge: "Tablero creado correctamente",
      data: board
    });

  }catch(error){
    next(error);
  }

}

async update(req: Request, res: Response, next: NextFunction){

  try{

    const data = updateBoardSchema.parse(req.body);

    const boardId = mongoIdSchema.parse(req.params.id);

    const board = await this.boardService.update(
      boardId, data
    );

    return res.status(200).json({
      message: "Tablero actulizado correctamente",
      data: board
    });

  }catch(error){
    next(error);
  }

}

async delete(req: Request, res: Response, next: NextFunction){

  try{

   const boardId = mongoIdSchema.parse(req.params.id);

   await this.boardService.delete(boardId);

   return res.status(204).send();

  }catch(error){
    next(error);
  }

}

}