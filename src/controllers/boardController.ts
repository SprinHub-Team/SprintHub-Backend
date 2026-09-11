import {Request, Response, NextFunction} from 'express';
import { BoardService } from '../service/boardService';
import { createBoardSchema, updateBoardSchema } from '../dtos/BoardDto';
import {mongoIdSchema} from '../utils/idValidator'

export class BoardController {
  constructor(private boardService: BoardService) {}

  async findByGroupId(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = mongoIdSchema.parse(req.params.groupId);

      const boards = await this.boardService.findByGroupId(groupId);

      return res.status(200).json({
        data: boards,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;

      const data = createBoardSchema.parse({ ...req.body});

      const board = await this.boardService.create(data, userId);

      return res.status(201).json({
        message: "Tablero creado correctamente",
        data: board,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;

      const data = updateBoardSchema.parse(req.body);

      const boardId = mongoIdSchema.parse(req.params.id);

      const board = await this.boardService.update(boardId, data, userId);

      return res.status(200).json({
        message: "Tablero actulizado correctamente",
        data: board,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      const userId = req.user.userId;

      const boardId = mongoIdSchema.parse(req.params.id);

      await this.boardService.delete(boardId, userId);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}