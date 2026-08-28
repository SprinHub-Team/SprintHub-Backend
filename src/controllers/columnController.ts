import { Request, Response } from 'express';
import { ColumnModel } from '../models/Column';
import { BoardModel } from '../models/Board';

export const getColumnsByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const columns = await ColumnModel.find({ boardId });
    // Populating would be good, but we can also just fetch cards separately
    res.json(columns);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createColumn = async (req: Request, res: Response) => {
  try {
    const { name, boardId } = req.body;
    const newColumn = await ColumnModel.create({ name, boardId, cardsId: [] });
    
    // Add to board's columnsIds
    await BoardModel.findByIdAndUpdate(boardId, {
      $push: { columnsIds: newColumn._id }
    });

    res.status(201).json(newColumn);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await ColumnModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const col = await ColumnModel.findById(id);
    if(col){
       await BoardModel.findByIdAndUpdate(col.boardId, {
         $pull: { columnsIds: id }
       });
       await ColumnModel.findByIdAndDelete(id);
    }
    res.json({ message: 'Columna eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
