import {Request, Response, NextFunction} from 'express';
import { BoardService } from '../service/BoardService';
import { createBoardSchema, updateBoardSchema } from '../dtos/BoardDto';
import {mongoIdSchema} from '../utils/idValidator'

export class BoardController{

constructor(
  private boardService: BoardService
){}
findByGroupId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const groupId = mongoIdSchema.parse(req.params.groupId);
    const boards = await this.boardService.findByGroupId(groupId);
    return res.status(200).json({
      data: boards
    });
  }catch(error){
    next(error);
  }
}

getBoardWhitDetails = async (req: Request, res: Response, next: NextFunction) => {
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

create = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ownerId = (req as any).user?.userId || (req as any).user?.id || req.body.ownerId;
    const data = createBoardSchema.parse({ ...req.body, ownerId });
    const board = await this.boardService.create(data);
    return res.status(201).json({
      message: "Tablero creado correctamente",
      data: board
    });
  }catch(error){
    next(error);
  }
}

update = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const data = updateBoardSchema.parse(req.body);
    const boardId = mongoIdSchema.parse(req.params.id);
    const board = await this.boardService.update(boardId, data);
    return res.status(200).json({
      message: "Tablero actulizado correctamente",
      data: board
    });
  }catch(error){
    next(error);
  }
}

delete = async (req: Request, res: Response, next: NextFunction) => {
  try{
   const boardId = mongoIdSchema.parse(req.params.id);
   await this.boardService.delete(boardId);
   return res.status(204).send();
  }catch(error){
    next(error);
  }
}

}