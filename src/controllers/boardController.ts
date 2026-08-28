import { Request, Response } from 'express';
import { BoardService } from '../service/BoardService';
import { BoardRepository } from '../repository/BoardRepository';
import { ColumnRepository } from '../repository/ColumnRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

const boardRepository = new BoardRepository();
const columnRepository = new ColumnRepository();
const boardService = new BoardService(boardRepository, columnRepository);

export const getBoardsByGroup = async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.groupId as string;
    const boards = await boardService.findByGroupId(groupId);
    res.json(boards);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, ownerId: req.user?.userId };
    const newBoard = await boardService.create(data);
    res.status(201).json(newBoard);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updatedBoard = await boardService.update(id, req.body);
    res.json(updatedBoard);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await boardService.delete(id);
    res.json({ message: 'Tablero eliminado' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
